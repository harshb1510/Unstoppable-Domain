import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Box, Typography } from "@mui/material";
import makeCryptoPayment from "../utils/constants";

const SlotExit = () => {
  const history = useNavigate();
  const [payableAmount, setPayableAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const initPayment = (data) => {
    const options = {
      key: "rzp_test_XDJyRLoZSTmLWa",
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderDetails.razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyUrl = `http://localhost:8080/listings/verify`;
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          await axios.post(verifyUrl, verifyData);
          history("/admin");
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleProceed = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/listings/bookings/addBooking",
        {
          rentPrice: data,
        }
      );
      initPayment(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const qrData = async (text) => {
    const slotBooking = JSON.parse(text);
    const slotExit = await fetch("http://localhost:8080/parking/slotExit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: slotBooking.slotId,
      }),
    });
    const data = await slotExit.json();
    if (!data.payableAmount) {
      alert("Slot is already free");
      return;
    }
    setPayableAmount(data.payableAmount);
    setShowModal(true);
  };

  const handlePayWithRazorpay = async () => {
    setShowModal(false);
    await handleProceed(payableAmount);
  };

  const handlePayWithWallet = async () => {
    setShowModal(false);
    const cryptoAmount = payableAmount * 0.011;
    const cryptoAddress = "0xC3385be7163DA9ee64dfE1847De5dC9c8Aa88eC0";
    await makeCryptoPayment(cryptoAddress, cryptoAmount);
    history("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Slot Exit
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please scan the QR code to exit the parking slot.
        </p>
        <div className="bg-gray-200 rounded-lg p-4 mb-8">
          <Scanner
            components={{
              audio: false,
            }}
            options={{
              delayBetweenScanSuccess: 10000,
            }}
            onResult={(text) => qrData(text)}
            onError={(error) => console.log(error?.message)}
            className="w-full h-64 rounded-lg overflow-hidden"
          />
        </div>
        <p className="text-center text-gray-600">
          Position the QR code within the frame to scan.
        </p>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="payment-modal-title" variant="h6" component="h2" gutterBottom>
            Payment Details
          </Typography>
          <Typography id="payment-modal-description" sx={{ mt: 2, mb: 4 }}>
            Payable Amount: {payableAmount} Rs. ({(payableAmount * 0.011).toFixed(4)} MATIC)
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handlePayWithRazorpay}
              variant="contained"
              sx={{ bgcolor: 'green', color: 'white', '&:hover': { bgcolor: 'darkgreen' } }}
            >
              Pay with Razorpay
            </Button>
            <Button
              onClick={handlePayWithWallet}
              variant="contained"
              sx={{ bgcolor: 'red', color: 'white', '&:hover': { bgcolor: 'darkred' } }}
            >
              Pay with Wallet
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SlotExit;
