import { useState, type FormEvent } from 'react';
import { Edit2, Trash2Icon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { axiosInstance, errorHandler } from '../services';
import { addAddress, removeAddress, updateAddress } from '../redux/addressSlice';
import { Input } from '../components/ui';
import { countries } from '../utils';

const defaultValue = {
  _id: '',
  name: '',
  email: '',
  phone: 0,
  addressLine1: '',
  city: '',
  state: '',
  postalCode: 0,
  country: '',
  default: false,
  addressLine2: '',
};

const ShippingAddress = () => {
  const { items } = useAppSelector((state) => state.address);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [formData, setFormData] = useState<AddressType>();

  const handleAddressSubmit = async (item: AddressType) => {
    try {
      setLoading(true);
      if (!item.addressLine1 || !item.city || !item.postalCode || item.state || item.phone) {
        throw new Error('please fill all filed');
      }
      const method = item?._id ? 'patch' : 'post';
      const url = item?._id ? `/address/${item._id}` : '/address';

      const res = await axiosInstance[method](url, item);

      if (res.data) {
        if (item._id) {
          dispatch(updateAddress(res.data.data));
        } else {
          dispatch(addAddress(res.data.data));
        }

        setIsOpenForm(false);
        setFormData(defaultValue);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await axiosInstance.delete(`/address/${id}`);
      dispatch(removeAddress(id));
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className='mx-auto max-w-6xl py-4'>
      <div
        onClick={() => {
          setIsOpenForm(!isOpenForm);
          setFormData(defaultValue);
        }}
        className='border border-gray-300 cursor-pointer card mb-5 relative max-w-3xl'>
        <p className='font-medium pl-2 text-xl'>Add New Address</p>
      </div>

      {items &&
        items?.map((item) => {
          return (
            <AddressItem
              key={item._id}
              item={item}
              isDelete={() => handleDeleteAddress(item._id || '')}
              isEdit={() => {
                setIsOpenForm(true);
                setFormData(item);
              }}
            />
          );
        })}

      {isOpenForm && (
        <AddressForm
          item={formData}
          loading={loading}
          onClose={() => {
            setIsOpenForm(false);
            setFormData(defaultValue);
          }}
          onSubmit={handleAddressSubmit}
        />
      )}
    </div>
  );
};

export default ShippingAddress;

type AddressFormProp = {
  loading: boolean;
  onSubmit: (item: AddressType, value?: string) => Promise<void>;
  onClose: () => void;
  item?: AddressType;
};

const AddressForm = ({ item, loading, onSubmit, onClose }: AddressFormProp) => {
  const [formData, setFormData] = useState<AddressType>(item?._id ? item : defaultValue);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData, item?._id);
  };

  return (
    <div className='fixed inset-0 w-full h-full flex items-center justify-center bg-black/10'>
      <form
        className='space-y-4 max-w-2xl w-full p-5 sm:p-10 mx-3 shadow-2xl bg-white rounded-xl'
        onSubmit={handleSubmit}>
        <p className='text-2xl font-semibold'>{item?._id ? 'Update Address' : 'Add New Address'}</p>
        <Input
          label='AddressLine1'
          name='addressLine1'
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
        />
        <Input
          label='AddressLine2 (optional)'
          name='addressLine2'
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
        />
        <Input
          label='City'
          name='city'
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        <div className='flex gap-4'>
          <Input
            label='Postal code'
            name='postalCode'
            type='number'
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: Number(e.target.value) })}
          />
          <select
            name='country'
            id='country'
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
            <option value=''>select country</option>
            {countries.map((country) => (
              <option id={country.id}>{country.title}</option>
            ))}
          </select>
        </div>
        <label htmlFor='address default' className='flex gap-2'>
          <input
            type='checkbox'
            name='default'
            id='address default'
            checked={formData.default}
            onChange={(e) => {
              console.log(e.target.checked);
              setFormData({
                ...formData,
                default: e.target.checked,
              });
            }}
          />
          <span>Default Address</span>
        </label>

        <div className='flex gap-5 mt-5 max-w-[300px]'>
          <button
            onClick={onClose}
            type='button'
            className='text-red-600 btn text-nowrap w-full border border-red-600'>
            Cancel
          </button>
          <button type='submit' className='bg-indigo-600 btn text-nowrap w-full text-white'>
            {loading ? 'Loading...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

type AddressItemProps = {
  item: AddressType;
  isEdit: () => void;
  isDelete: () => void;
};

const AddressItem = ({ item, isEdit, isDelete }: AddressItemProps) => {
  return (
    <div key={item._id} className='relative mb-5 max-w-3xl'>
      <div className={`capitalize !pl-5 border border-gray-300 cursor-pointer card`}>
        {item.default && <p className='status-active w-fit mb-2'>Default</p>}
        <div className='flex items-center'>
          <p className='font-semibold'>{item.addressLine1}</p>
          <button onClick={isEdit} className='svg-btn p-2 '>
            <Edit2 />
          </button>
          <button onClick={isDelete} className='svg-btn p-2  text-red-600'>
            <Trash2Icon />
          </button>
        </div>
        <p>
          {item.city}, {item.postalCode}, <br />
          {countries.filter((i) => i.title === item?.country)[0]?.title}
        </p>
      </div>
    </div>
  );
};
