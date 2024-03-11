import Image from 'next/image';
import successImage from '../../../public/hippo-success.png'; // Update the path to where you save the image

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-green-100">
      <h1 className="text-2xl font-bold text-green-800">Transaction Successful!</h1>
      <p className="mt-3 text-lg text-green-600">Your payment has been processed successfully.</p>
      <div className="mt-5">
        <Image src={successImage} alt="Success" width={200} height={200} />
      </div>
      <button className="mt-5 px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out">
        Continue Shopping
      </button>
    </div>
  );
};