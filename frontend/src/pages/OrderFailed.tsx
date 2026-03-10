import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderFailed = () => {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center'>
        <XCircle className='text-red-500 w-16 h-16 mx-auto mb-4' />
        <h1 className='text-2xl font-bold mb-2'>Payment Failed</h1>
        <p className='text-gray-600 mb-6'>
          Oops! Something went wrong. Your payment was not successful.
        </p>
        <Link
          to='/'
          className='inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl transition'>
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default OrderFailed;
