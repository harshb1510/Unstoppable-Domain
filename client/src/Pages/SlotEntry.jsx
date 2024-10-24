import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SlotEntry = () => {
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [scanned, setScanned] = useState(false);

  const redirect = async () => {
    toast.success("Slot Entry Successful");
    // Uncomment these lines when you're ready to redirect
    history("/admin");
    window.location.reload();
  };

  const add = async () => {
    try {
      const response = await fetch("https://unstoppable-domain.onrender.com/parking/addSlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding slots:", error);
    }
  };

  const qrData = async (text) => {
    if (scanned) return;

    setScanned(true);
    const slotBooking = JSON.parse(text);
    const slotEntry = await fetch("https://unstoppable-domain.onrender.com/parking/slotEntry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slotId: slotBooking.slotId,
        carOwner: user._id,
      }),
    });
    const data = await slotEntry.json();
    console.log(data);
    await redirect();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Slot Entry
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please scan the QR code to enter the parking slot.
        </p>
        <div className="bg-gray-200 rounded-lg p-4 mb-8">
          <Scanner
            components={{
              audio: false,
              video: false,
            }}
            options={{
              delayBetweenScanAttempts: 1000,
              delayBetweenScanSuccess: 10000,
            }}
            onResult={(text, result) => qrData(text, result)}
            onError={(error) => console.log(error?.message)}
            className="w-full h-64 rounded-lg overflow-hidden"
          />
        </div>
        {scanned ? (
          <p className="text-center text-green-600 font-semibold">
            QR Code scanned successfully!
          </p>
        ) : (
          <p className="text-center text-gray-600">
            Position the QR code within the frame to scan.
          </p>
        )}
      </div>
    </div>
  );
};

export default SlotEntry;
