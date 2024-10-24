import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/Hero.png";

const Hero = () => {
  return (
    <section
      id="home"
      className="flex justify-between items-center bg-gradient-to-br from-green-50 to-green-100 p-10 m-6 rounded-xl mb-[40px] shadow-md relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bottom-0 right-0"></div>
        <div className="absolute w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="flex flex-col flex-1 relative z-10">
        <div className="mb-8">
          <h1 className="font-poppins font-semibold text-6xl text-green-800 leading-snug">
            Discover the <br className="sm:hidden" />
            <span className="text-green-600">Ultimate </span>
            Car Rental Experience
          </h1>
          <Link
            to="/"
            className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
          >
            Learn More
          </Link>
        </div>
        <div>
          <h2 className="font-poppins font-semibold text-3xl leading-snug text-green-700 mb-4">
            Easy Payment Methods
          </h2>
          <p className="text-green-800 text-lg">
            Our team of experts ensures a seamless payment experience, tailored
            to your needs. We prioritize secure transactions, low fees, and
            user-friendly interfaces, empowering you to book and pay for your
            car rental or parking spot hassle-free.
          </p>
        </div>
      </div>
      <div className="flex-1 relative z-10">
        <img src={hero} alt="Hero" className="w-full" />
      </div>
    </section>
  );
};

export default Hero;
