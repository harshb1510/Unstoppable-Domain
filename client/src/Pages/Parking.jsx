import React from "react";
import { Link } from "react-router-dom";
import park from "../assets/park.png";
import Step1 from "../assets/Step1.png";
import Step2 from "../assets/Step2.png";
import Step3 from "../assets/Step3.png";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import parkGif from "../assets/dribbble_2.gif";

const Parking = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
        <section className="flex justify-between items-center p-10 m-6 rounded-xl shadow-md relative overflow-hidden">
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
                Parking Solution
              </h1>
              <Link
                to="/park"
                className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
              >
                For Parking ...
              </Link>
            </div>
            <div>
              <h2 className="font-poppins font-semibold text-3xl leading-snug text-green-700 mb-4">
                Easy Parking Management
              </h2>
              <p className="text-green-800 text-lg">
                Our team of experts ensures a seamless parking experience,
                tailored to your needs. We prioritize secure transactions, low
                fees, and user-friendly interfaces, empowering you to find and
                reserve parking spots hassle-free.
              </p>
            </div>
          </div>
          <div className="flex-1 relative z-10">
            <img src={park} alt="Parking" className="w-full max-w-[600px] object-contain" />
          </div>
        </section>

        <section className="flex justify-center items-center my-12">
          <div className="border shadow-xl rounded-lg overflow-hidden">
            <img src={parkGif} className="h-[300px] p-[20px]" alt="Parking Animation" />
          </div>
        </section>

        <section className="p-8 bg-white rounded-lg shadow-md mx-6">
          <div className="flex flex-col items-center mb-12">
            <h2 className="font-poppins font-semibold text-3xl text-green-700 mb-4">
              How it works
            </h2>
            <p className="text-center text-lg text-green-800 max-w-2xl">
              Our platform is designed to make parking easy and convenient.
              With our user-friendly interface, you can easily find and
              reserve parking spots in your area.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
            <StepCard
              image={Step1}
              description="Search for parking spots in your area. Our platform provides a wide range of options, including public parking lots, private garages, and residential parking spaces."
            />
            <StepCard
              image={Step2}
              description="Reserve your parking spot. Our platform allows you to book parking spots in advance, ensuring that you have a secure place to park your vehicle."
            />
            <StepCard
              image={Step3}
              description="Park your vehicle. Our platform provides detailed instructions on how to access your parking spot, ensuring a seamless parking experience."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const StepCard = ({ image, description }) => (
  <div className="flex flex-col items-center max-w-sm">
    <img src={image} alt="Step" className="w-24 h-24 mb-4" />
    <p className="text-center text-green-800">{description}</p>
  </div>
);

export default Parking;
