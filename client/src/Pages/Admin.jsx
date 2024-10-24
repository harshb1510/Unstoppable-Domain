import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import axios from 'axios'

const Admin = () => {
  const [slots, setSlots] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get('https://unstoppable-domain.onrender.com/parking/allSlot')
        setSlots(response.data)

        // Calculate total earnings
        const earnings = response.data.reduce((acc, slot) => acc + (slot.amount || 0), 0)
        setTotalEarnings(earnings)
      } catch (error) {
        console.error('Error fetching slots:', error)
      }
    }

    fetchSlots()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Link to='/slotentry' className='bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 text-center'>
            Slot Entry
          </Link>
          <Link to='/slotexit' className='bg-green-500 hover:bg-green-700 text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 text-center'>
            Slot Exit
          </Link>
          <Link to='/slot' className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 text-center'>
            Slot
          </Link>
          <Link to='/video_feed' className='bg-red-500 hover:bg-red-700 text-white font-bold text-lg py-4 px-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 text-center'>
            Video Feed
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 p-4 border-b">Slot Details</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-gray-200 text-left">Slot No</th>
                <th className="py-3 px-4 bg-gray-200 text-left">Occupied</th>
                <th className="py-3 px-4 bg-gray-200 text-left">In Time</th>
                <th className="py-3 px-4 bg-gray-200 text-left">Out Time</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{slot.slotNo}</td>
                  <td className="py-3 px-4">{slot.occupied ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4">{new Date(parseInt(slot.inTime)).toLocaleString()}</td>
                  <td className="py-3 px-4">{slot.outTime ? new Date(parseInt(slot.outTime)).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-xl font-bold text-gray-800">
            Total Earnings: ₹{totalEarnings}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
