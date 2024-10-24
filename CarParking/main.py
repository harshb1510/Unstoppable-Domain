import cv2
import pickle
import numpy as np
from fastapi import FastAPI
from fastapi.responses import JSONResponse, StreamingResponse
from sse_starlette.sse import EventSourceResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import threading
import time
import asyncio
import json
import logging
from collections import deque


logging.basicConfig(level=logging.INFO)


# Load parking spot positions
with open('CarParkPos', 'rb') as f:
    posList = pickle.load(f)
width, height = 100, 40


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

state = {
    "total_spaces": len(posList),
    "free_spaces": len(posList),
    "space_status": {i: {"position": pos, "status": "Empty"} for i, pos in enumerate(posList)}
}

state_lock = threading.Lock()
stop_event = threading.Event()

# New: Use a deque to store recent status for each spot
status_history = {i: deque(maxlen=5) for i in range(len(posList))}


def process_frame(img):
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (3, 3), 1)
    imgThreshold = cv2.adaptiveThreshold(
        imgBlur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 16)
    imgMedian = cv2.medianBlur(imgThreshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    imgDilate = cv2.dilate(imgMedian, kernel, iterations=1)
    return imgDilate


def checkParkingSpace(imgPro, img):
    spaceCounter = 0
    spaceStatus = {}
    for i, pos in enumerate(posList):
        x, y = pos

        imgCrop = imgPro[y:y + height, x:x + width]
        count = cv2.countNonZero(imgCrop)
        
        # Determine current status
        current_status = "Empty" if count < 660 else "Filled"
        
        # Add current status to history
        status_history[i].append(current_status)
        
        # Determine final status based on majority in recent history
        final_status = max(set(status_history[i]), key=status_history[i].count)
        
        if final_status == "Empty":
            color = (0, 255, 0)
            thickness = 5
            spaceCounter += 1
        else:
            color = (0, 0, 255)
            thickness = 2
        
        spaceStatus[i] = {"position": (x, y), "status": final_status}
        cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), color, thickness)
        cv2.putText(img, str(i), (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    return spaceCounter, spaceStatus


def update_parking_status():
    cap = cv2.VideoCapture('carPark.mp4')
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_time = 1 / fps
    global state
    while not stop_event.is_set():
        start_time = time.time()
        if cap.get(cv2.CAP_PROP_POS_FRAMES) == cap.get(cv2.CAP_PROP_FRAME_COUNT):
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        success, img = cap.read()
        if not success:
            logging.warning("Failed to read frame.")
            continue

        imgPro = process_frame(img)
        spaceCounter, spaceStatus = checkParkingSpace(imgPro, img)

        with state_lock:
            state["free_spaces"] = spaceCounter
            state["space_status"] = spaceStatus

        processing_time = time.time() - start_time
        sleep_time = max(frame_time - processing_time, 0)
        time.sleep(sleep_time)

    cap.release()


@app.on_event("startup")
async def startup_event():
    logging.info("Starting parking status update thread.")
    threading.Thread(target=update_parking_status, daemon=True).start()


@app.on_event("shutdown")
def shutdown_event():
    logging.info("Shutting down, releasing resources.")
    stop_event.set()


@app.get("/")
async def root():
    return {"message": "Welcome to the Parking Spot Detector"}


@app.get("/check_parking")
async def check_parking():
    with state_lock:
        return JSONResponse(content=state)


@app.get("/video_feed")
async def video_feed():
    def generate():
        cap = cv2.VideoCapture('carPark.mp4')
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_time = 1 / fps
        while True:
            start_time = time.time()
            if cap.get(cv2.CAP_PROP_POS_FRAMES) == cap.get(cv2.CAP_PROP_FRAME_COUNT):
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, img = cap.read()
            if not success:
                logging.warning("Failed to read frame.")
                break

            imgPro = process_frame(img)
            checkParkingSpace(imgPro, img)
            _, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            processing_time = time.time() - start_time
            sleep_time = max(frame_time - processing_time, 0)
            time.sleep(sleep_time)

        cap.release()

    return StreamingResponse(generate(), media_type='multipart/x-mixed-replace; boundary=frame')


@app.get("/sse_parking_status")
async def sse_parking_status():
    async def event_generator():
        while not stop_event.is_set():
            with state_lock:
                data = json.dumps(state)
            yield {
                "event": "update",
                "data": data
            }
            await asyncio.sleep(1/30)  # Update roughly 30 times per second

    return EventSourceResponse(event_generator())


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
