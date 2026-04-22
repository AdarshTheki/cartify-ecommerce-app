import { Edit2, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils';
import type { Address } from '../../types';

const AddressItem = ({ onDelete, ...item }: { onDelete?: () => void } & Address) => {
  const navigate = useNavigate();
  return (
    <div className='relative mb-5'>
      <div className={`capitalize !pl-5 border border-gray-300 cursor-pointer card`}>
        <div className='flex items-center'>
          <p className='font-semibold'>{item.title}</p>
          <button
            onClick={() => navigate(`/shipping-address/${item._id}`)}
            className='svg-btn p-2 '>
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className='svg-btn p-2  text-red-600'>
            <Trash2Icon size={16} />
          </button>
        </div>
        <p>{cn('Address Line 1:', item.addressLine1)}</p>
        {item.addressLine2 && <p>{cn('Address Line 2:', item.addressLine2)}</p>}
        <p>{cn('City:', item.city)}</p>
        <p>{cn('Landmark:', item.landmark)}</p>
        <p>{cn('Country:', item.country)}</p>
        <p>{cn('Zip code:', item.postalCode)}</p>
        <p>{cn('Phone Number:', item.phoneNumber)}</p>
      </div>
    </div>
  );
};

export default AddressItem;
