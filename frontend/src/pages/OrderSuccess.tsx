import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center'>
        <CheckCircle className='text-green-500 w-16 h-16 mx-auto mb-4' />
        <h1 className='text-2xl font-bold mb-2'>Payment Successful!</h1>
        <p className='text-gray-600 mb-6'>
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Link
          to='/'
          className='inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition'>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
