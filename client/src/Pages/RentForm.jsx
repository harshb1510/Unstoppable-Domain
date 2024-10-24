import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";

export default function RentForm() {
  const [carName, setCarName] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [location, setLocation] = useState("");
  const [kms, setKms] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [availableTill, setAvailableTill] = useState("");
  const [url1, setUrl1] = useState(null);
  const [url2, setUrl2] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleFirstUpload = async (e) => {
    const file = e.target.files[0];
    setImage1(file);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploadImage");
    data.append("cloud_name", "du9foikdt");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/du9foikdt/image/upload",
        data
      );
      const cloudData = await res.data;
      setUrl1(cloudData.url);
      console.log(cloudData.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSecondUpload = async (e) => {
    const file = e.target.files[0];
    setImage2(file);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploadImage");
    data.append("cloud_name", "du9foikdt");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/du9foikdt/image/upload",
        data
      );
      const cloudData = await res.data;
      setUrl2(cloudData.url);
      console.log(cloudData.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://unstoppable-domain.onrender.com/listings/listNewCar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carName,
        image1: url1,
        image2: url2,
        location,
        kms,
        hourlyRate,
        dailyRate,
        available: true,
        carOwner: user.fullName,
        carOwnerEmail: user.email,
        carOwnerId: user._id,
        availableTill,
      }),
    });
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
      toast.error(data.error);
    } else {
      console.log(data);
      toast.success("Car Listed Successfully");
      navigate("/myCar");
    }
  };

  // Get today's date in the format 'YYYY-MM-DDTHH:MM'
  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-green-500 mb-6">
            Rental Entry
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="text"
                placeholder="Car Name"
                aria-label="Car Name"
                required
                onChange={(e) => setCarName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="file"
                aria-label="Upload Image"
                required
                onChange={handleFirstUpload}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="file"
                aria-label="Upload Image"
                required
                onChange={handleSecondUpload}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="text"
                placeholder="Location"
                aria-label="Location"
                required
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Total KMS"
                aria-label="Total KMS"
                required
                onChange={(e) => setKms(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Hourly Rate"
                aria-label="Price Per Hour"
                required
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Daily Rate"
                aria-label="Price Per Day"
                required
                onChange={(e) => setDailyRate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                type="datetime-local"
                placeholder="Available Till"
                aria-label="Available Till"
                required
                min={today} // Set the minimum date to today
                onChange={(e) => setAvailableTill(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
