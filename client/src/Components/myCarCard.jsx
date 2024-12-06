import React, { useState } from 'react';
import { Carousel } from 'flowbite-react';
import BookingModal from './BookingModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';



const Card = ({ id, carName, ownerName, kms, image1, image2, available, availableTill, dailyRate, hourlyRate, location, rent }) => {
  const [carAvailable, setCarAvailable] = useState(available);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClick = async (id) => {
    try {
      const res = await axios.post("http://localhost:8080/listings/removeCar", 
        { id: id },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user.email
          }
        }
      );
      if (res.data.available !== undefined) {
        setCarAvailable(res.data.available);
        toast.success("Changes Saved Successfully");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div 
      className="flex justify-center p-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-lg w-full rounded-lg border border-gray-200 shadow-lg bg-white text-black overflow-hidden">
        <div className="relative w-full h-48">
          <Carousel slideInterval={3000}>
            <img src={image1} alt="Car" className="w-full h-full object-cover" />
            <img src={image2} alt="Car" className="w-full h-full object-cover" />
          </Carousel>
        </div>
        <div className="p-4">
          <h1 className="text-center text-2xl font-bold mb-2 text-green-700">{carName}</h1>
          <hr className="my-2 border-green-200" />
          <div className="flex justify-between pt-3 mb-2">
            <div>
              <p className="text-[15px] font-extrabold text-green-600">{ownerName}</p>
              <p className="text-[14px]"><span className="font-bold">Rate:</span> ${hourlyRate}/hr</p>
              <p className="text-[14px]"><span className="font-bold">Kms:</span> {kms}</p>
            </div>
            <div>
              <p className="text-[14px]"><span className="font-bold">Location:</span> {location}</p>
              <p className="text-[14px]"><span className="font-bold">Day Rate:</span> ${dailyRate}/day</p>
              <p className="text-[14px]"><span className="font-bold">Available Till:</span> {availableTill}</p>
            </div>
          </div>
          {!rent ? (
            <motion.button 
              className='w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(id)}
            >
              {carAvailable ? "Remove from List" : "Add to List"}
            </motion.button>
          ) : (
            <h1 className='font-bold text-lg text-green-600 text-center mt-4'>
              Your Car is on Rent
            </h1>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
