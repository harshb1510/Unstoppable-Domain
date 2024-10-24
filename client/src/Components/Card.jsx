import React from "react";
import { Carousel } from "flowbite-react";
import BookingModal from "./BookingModal";

const Card = ({ id, carName, carOwnerId, ownerName, kms, image1, image2, available, availableTill, dailyRate, hourlyRate, location }) => {  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative w-full h-48">
        <Carousel slideInterval={3000}>
          <img src={image1} alt="Car" className="w-full h-full object-cover" />
          <img src={image2} alt="Car" className="w-full h-full object-cover" />
        </Carousel>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-green-700 mb-2">{carName}</h2>
        <div className="border-t border-green-200 pt-2 mb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-semibold">Owner:</span> {ownerName}</p>
            <p><span className="font-semibold">Location:</span> {location}</p>
            <p><span className="font-semibold">Hourly Rate:</span> ₹{hourlyRate}/hr</p>
            <p><span className="font-semibold">Daily Rate:</span> ₹{dailyRate}/day</p>
            <p><span className="font-semibold">Kms Driven:</span> {kms} km</p>
            <p><span className="font-semibold">Available Till:</span> {new Date(availableTill).toLocaleDateString()}</p>
          </div>
        </div>
        <BookingModal
          availableTill={availableTill}
          dailyRate={dailyRate}
          hourlyRate={hourlyRate}
          carOwnerId={carOwnerId}
          id={id}
        />
      </div>
    </div>
  );
};

export default Card;
