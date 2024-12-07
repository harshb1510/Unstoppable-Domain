import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import axios from "axios";

const Slot = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [price, setPrice] = useState("100");
  const [freeSlot, setFreeSlot] = useState(0);

  useEffect(() => {
    fetchSlotsData(); // Initial fetch
    const fetchInterval = setInterval(() => {
      fetchSlotsData(); // Poll every 5 seconds
    }, 5000);

    const eventSource = setupSSE(); // Setup SSE for real-time updates

    return () => {
      clearInterval(fetchInterval); // Cleanup polling
      eventSource.close(); // Cleanup SSE
    };
  }, []);

  const fetchSlotsData = async () => {
    try {
      const [realTimeResponse, dbResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/check_parking"),
        axios.get("http://localhost:8080/parking/allSlot"),
      ]);

      const realTimeData = realTimeResponse.data;
      const dbData = dbResponse.data;

      const mergedSlots = mergeSlotData(realTimeData, dbData);
      updateSlots(mergedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const mergeSlotData = (realTimeData, dbData) => {
    const slotsStatus = realTimeData.space_status;
    const dbSlots = dbData.reduce((acc, slot) => {
      acc[slot.slotNo] = slot;
      return acc;
    }, {});

    return Object.keys(slotsStatus).map((key) => {
      const slotNo = parseInt(key);
      const isFree = slotsStatus[key].status === "Empty" && !dbSlots[slotNo]?.occupied;
      return {
        slotNo,
        isFree,
      };
    });
  };

  const updateSlots = (mergedSlots) => {
    const freeSlots = mergedSlots.filter(slot => slot.isFree).length;
    setFreeSlot(freeSlots);
    setSlots(mergedSlots);
  };

  const setupSSE = () => {
    const eventSource = new EventSource("http://127.0.0.1:8000/sse_parking_status");
    eventSource.onmessage = (event) => {
      const parkingData = JSON.parse(event.data);
      console.log("Received SSE update:", parkingData);
      updateSlotsFromSSE(parkingData);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return eventSource;
  };

  const updateSlotsFromSSE = (parkingData) => {
    setSlots(prevSlots => {
      const updatedSlots = prevSlots.map(slot => {
        const newStatus = parkingData.space_status[slot.slotNo.toString()];
        return {
          ...slot,
          isFree: newStatus && newStatus.status === "Empty"
        };
      });
      const freeSlots = updatedSlots.filter(slot => slot.isFree).length;
      setFreeSlot(freeSlots);
      return updatedSlots;
    });
  };

  const handleSlotBook = (slotNo) => {
    const selectedSlot = slots.find((slot) => slot.slotNo === slotNo);
    if (selectedSlot && selectedSlot.isFree) {
      setSelectedSlot(selectedSlot);
      setIsModalOpen(true);
    } else {
      toast.error("This slot is already occupied. Please select another slot.");
    }
  };

  const confirmSlotBooking = () => {
    if (!selectedSlot) {
      console.error("No slot selected for booking");
      toast.error("No slot selected for booking");
      return;
    }

    const tempBookingData = {
      slotId: selectedSlot.slotNo,
      carOwner: "60d5ecf5d4b2f8a6f1d7c3f1",
      carRegistrationNumber: "ABCD1",
    };

    setBookingData(tempBookingData);
    setIsModalOpen(false);

    // Update the local state to reflect the booking
    setSlots(prevSlots => prevSlots.map(slot => 
      slot.slotNo === selectedSlot.slotNo ? { ...slot, isFree: false } : slot
    ));
    setFreeSlot(prevFreeSlot => prevFreeSlot - 1);
  };

  const cancelSlotBooking = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <Navbar />
      <h2 className="text-5xl font-bold text-center p-[10px] mb-4">Slots</h2>
      <div className="flex justify-evenly items-center p-[20px]">
        <h3>
          <span className="font-bold">Current Price for Slot</span> : Rs. {price}/hr
        </h3>
        <h3>
          <span className="font-bold">Free Slots</span> : {freeSlot}
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.slotNo}
            onClick={() => handleSlotBook(slot.slotNo)}
            className={`border rounded-md p-4 cursor-pointer ${
              slot.isFree ? "bg-green-500" : "bg-red-400"
            }`}
          >
            <p className="font-bold text-[20px] text-center">{slot.slotNo}</p>
          </div>
        ))}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg font-semibold mb-4">Confirm Slot Booking</p>
            <p>Are you sure you want to book slot {selectedSlot.slotNo}?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmSlotBooking}
                className="px-4 py-2 mr-2 bg-green-500 text-white rounded-md"
              >
                Yes
              </button>
              <button
                onClick={cancelSlotBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* QR Code Modal */}
      {bookingData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-md shadow-md flex flex-col justify-center items-center">
            <p className="text-3xl font-semibold mb-4 leading-snug">Booking Successful!</p>
            <QRCode
              value={JSON.stringify(bookingData)}
              style={{ width: "200px", height: "200px" }}
            />
            <button
              onClick={() => setBookingData(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slot;
