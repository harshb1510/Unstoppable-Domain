import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { toast } from "react-toastify";
import { FaCar, FaClock } from "react-icons/fa";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getMyBookings = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const response = await fetch(
          "http://localhost:8080/listings/getMyBooking",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": user._id,
            },
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
          const bookingsWithTimeLeft = data.map(booking => ({
            ...booking,
            timeLeft: Math.floor((booking.timeLeft - Date.now()) / 3600000)
          }));
          setBookings(bookingsWithTimeLeft);
        } else {
          console.log("No bookings found for the user.");
        }
      } else {
        console.log("User or token not found in local storage.");
        toast.error("User not found");
      }
    };

    getMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">My Bookings</h1>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={booking.carImage}
                      alt={booking.carName}
                    />
                  </div>
                  <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
                      Your current rental
                    </div>
                    <h2 className="block mt-1 text-2xl leading-tight font-bold text-gray-900 mb-2">
                      {booking.carName}
                    </h2>
                    <div className="mt-4 flex items-center text-gray-700">
                      <FaCar className="mr-2" />
                      <span>Rent Price: ₹{booking.rentPrice || 'N/A'}</span>
                    </div>
                    <div className="mt-2 flex items-center text-gray-700">
                      <FaClock className="mr-2" />
                      <span>Return in: {booking.timeLeft} hours</span>
                    </div>
                    <div className="mt-6">
                      <button className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-300">
                        Extend Rental
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p className="text-xl">No active bookings found.</p>
            <button className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-300">
              Book a Car
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
