// components/PaymentForm.tsx
import React, { useRef, useState } from 'react';
import mpesalogo from "../../public/mpesalogo.png";
import Image from 'next/image';
import axios from 'axios';
import { Button } from './ui/button';

interface PaymentPopupProps {
  onClose: () => void;
  totalPrice: number; // Add this prop to accept the total price
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ onClose, totalPrice }) => {
  const phoneInput = useRef<HTMLInputElement>(null);
  const [isLoading,setIsLoading]=useState(false);
  const handleStk_push =async () => {
    if (  phoneInput.current !== null) {
      const phone = phoneInput.current.value;
      const amount = totalPrice;
  
    try {
      const response = await axios.post(process.env.MPESA_SERVER!, {
        phone,
        amount,
      });
        console.log('Payment initiated:', response.data);
     
     
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  }
};

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700 max-w-md">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            {/* Here you can use an icon for closing or just text */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="w-full pt-1 pb-5">
          <div className="bg-indigo-500 text-white overflow-hidden rounded-full w-20 h-20 -mt-16 mx-auto shadow-lg flex justify-center items-center">
            {/* Assuming you want to use an icon here, you can install @heroicons/react and use it or use an img tag */}
            <img className="mdi mdi-credit-card-outline text-3xl" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Ei-lock.svg" alt="Lock" />
          </div>
        </div>
        <div className="mb-10">
          <h1 className="text-center font-bold text-xl uppercase">Secure payment</h1>
        </div>
        <div className="mb-3">
          <div className="mb-3 text-center">
            <span className="text-lg font-semibold">Total Price: </span>
            <span className="text-xl font-bold">{totalPrice.toFixed(2)} KES</span>
          </div>
          <label className="font-bold text-sm mb-2 ml-1">Enter your Phone Number <i className='font-bold text-md text-blue-500'>(07.....)</i></label>
          <input ref={phoneInput} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="254712345678" type="number" />
        </div>
        <div className="mb-3 flex -mx-2">
          <div className="px-2">
            <label htmlFor="type1" className="flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type1" defaultChecked />
              <Image src={mpesalogo} className="h-8 ml-3 w-8" alt="Visa" />
            </label>
          </div>
          <div className="px-2">
            <label htmlFor="type2" className="flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type2" />
              <img src="https://www.sketchappsources.com/resources/source-image/PayPalCard.png" className="h-8 ml-3" alt="PayPal" />
            </label>
          </div>
        </div>
        <div>
          <Button onClick={handleStk_push}
          disabled={totalPrice ===0 || isLoading}
          className='w-full'
            >PAY NOW</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
