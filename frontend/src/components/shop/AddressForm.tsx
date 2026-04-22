import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAddress, updateAddress } from '../../services/addressService';
import { errorHandler } from '../../services';
import { Input } from '../index';
import type { Address, AddressFormData } from '../../types';

const AddressForm = ({ form }: { form: Address | null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddressFormData>({
    title: form?.title || '',
    addressLine1: form?.addressLine1 || '',
    city: form?.city || '',
    landmark: form?.landmark || '',
    postalCode: form?.postalCode || '',
    country: form?.country || '',
    phoneNumber: form?.phoneNumber || 0,
    isDefault: form?.isDefault || false,
    addressLine2: form?.addressLine2 || '',
  });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = form?._id
        ? await updateAddress(form._id, formData)
        : await createAddress(formData);
      if (res.data) {
        navigate('/shipping-address');
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className='mx-auto max-w-xl space-y-4 p-4'>
      <h2 className='text-2xl font-semibold text-center'>
        {form?._id ? 'Update Address' : 'Add Address'}
      </h2>
      <div className='grid grid-cols-2 gap-5'>
        <Input
          onChange={handleChangeInput}
          value={formData?.title}
          label='shipping name'
          name='title'
        />
        <Input
          onChange={handleChangeInput}
          value={formData?.phoneNumber}
          label='phone'
          name='phoneNumber'
        />
      </div>
      <Input
        onChange={handleChangeInput}
        value={formData?.addressLine1}
        label='address Line 1'
        name='addressLine1'
      />
      <Input
        onChange={handleChangeInput}
        value={formData?.addressLine2}
        label='address Line 2 (optional)'
        name='addressLine2'
      />
      <div className='grid grid-cols-2 gap-4'>
        <Input onChange={handleChangeInput} value={formData?.city} label='city' name='city' />
        <Input
          onChange={handleChangeInput}
          value={formData?.landmark}
          label='landmark'
          name='landmark'
        />
        <Input
          onChange={handleChangeInput}
          value={formData?.country}
          label='country'
          name='country'
        />
        <Input
          onChange={handleChangeInput}
          value={formData?.postalCode}
          label='postal code'
          name='postalCode'
        />
      </div>
      <label htmlFor='address default' className='flex gap-2'>
        <input
          onChange={handleChangeInput}
          checked={formData.isDefault}
          type='checkbox'
          name='isDefault'
          id='address default'
        />
        <span>Default Address</span>
      </label>

      <div className='flex gap-5 mt-5 max-w-[300px]'>
        <button
          onClick={() => navigate('/shipping-address')}
          type='button'
          className='text-red-600 btn text-nowrap w-full border border-red-600'>
          Cancel
        </button>
        <button type='submit' className='bg-indigo-600 btn text-nowrap w-full text-white'>
          Save
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
