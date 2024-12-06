import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import { motion } from 'framer-motion'

export default function RentalCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className='text-4xl text-center font-bold text-green-800 mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          "Lend or Rent: Choose Your Car Adventure"
        </motion.h1>

        <div className='flex flex-col md:flex-row justify-center items-center gap-8'>
          <CardItem
            image="https://images.ctfassets.net/2sam6k0rncvg/5IrIwFixQJSc5tLR2lCDzX/0e130341718ba9123e5ec0c5f4ab7526/car-lease-vs-car-loan.png"
            title="Lend your Vehicle"
            description="Monetize your idle car by listing it on our platform for others to rent, earning you extra income effortlessly."
            linkTo="/lend"
            linkText="Lend"
          />

          <CardItem
            image="https://img.freepik.com/free-vector/car-rental-concept-illustration_114360-9267.jpg?size=626&ext=jpg&ga=GA1.1.1395880969.1709337600&semt=ais"
            title="Rent a Vehicle"
            description="Explore a wide range of vehicles available for rent, with flexible options to suit your needs and budget."
            linkTo="/rent"
            linkText="Rent"
          />
        </div>
      </div>
    </div>
  )
}

const CardItem = ({ image, title, description, linkTo, linkText }) => (
  <motion.div 
    className="w-full max-w-sm bg-white  shadow-lg overflow-hidden"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    <img className="w-full h-48 object-cover" src={image} alt={title} />
    <div className="p-5">
      <h5 className="mb-2 text-2xl font-bold text-green-700">{title}</h5>
      <p className="mb-4 text-green-600">{description}</p>
      <Link 
        to={linkTo} 
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 transition duration-300"
      >
        {linkText}
        <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </Link>
    </div>
  </motion.div>
)
