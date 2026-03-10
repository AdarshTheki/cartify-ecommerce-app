import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Trending from '../Home/Trending';
import CommentListing from './CommentListing';
import { useDispatch } from 'react-redux';
import { useFetch } from '../../hooks';
import { axiosInstance, errorHandler } from '../../utils';
import { addItem } from '../../redux/cartSlice';
import type { AxiosError } from 'axios';
import { Button, Loading, NotFound } from '../../ui';
import HeartFavorite from '../../components/ProductFavorite';

const SingleProductPage = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch<ProductType>(`/product/${id}`);
  const [color, setColor] = useState<string>('black');
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      const res = await axiosInstance.post(`/cart`, { productId, quantity });
      if (res.data) {
        dispatch(addItem(res.data.data.items));
      }
    } catch (error) {
      errorHandler(error as AxiosError);
    }
  };

  if (loading) return <Loading />;

  if (error) return <NotFound title={JSON.stringify(error).split(`"`).join('')} />;

  return (
    <section>
      <div className='mx-auto container p-4 text-gray-800'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* <!-- Product Images --> */}
          <div className='space-y-4'>
            <div className='aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg'>
              <img
                src={product?.thumbnail || 'https://placehold.co/600x600'}
                alt='Product'
                className='object-cover w-full h-full rounded-lg transition-opacity duration-300 opacity-100'
                loading='lazy'
              />
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {Array.from({ length: 4 }, (_, index) => (
                <button key={index} className='aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg'>
                  <img
                    src={product?.images[index] || 'https://placehold.co/150x150'}
                    alt={index + '_Product-images'}
                    className='object-cover w-full h-full rounded-lg transition-opacity duration-300 opacity-100'
                    loading='lazy'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* <!-- Product Info --> */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{product?.title}</h1>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center'>
                  <Star className='text-yellow-400' />
                  <span className='ml-2 text-sm '>(128 reviews)</span>
                </div>
                <span className='text-green-600'>In Stock</span>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center'>
                <span className='text-3xl font-bold'>${product?.price}</span>
                <span className='ml-4 text-lg  line-through'>
                  ${(Number(product?.price) / (1 - Number(product?.discount) / 100)).toFixed(2)}
                </span>
                <span className='ml-2 bg-red-500 text-white px-2 py-1 text-sm rounded'>
                  {product?.discount}% OFF
                </span>
              </div>
              <p className='text-sm '>Price includes VAT</p>
            </div>

            {/* <!-- Color Selection --> */}
            <div>
              <h3 className='font-semibold mb-3'>Color:</h3>
              <div className='flex space-x-3'>
                {['black', 'blue', 'gray'].map((i) => (
                  <button
                    onClick={() => setColor(i)}
                    style={{ background: i }}
                    key={i}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      i === color && 'ring-2 ring-offset-2 ring-black'
                    }`}></button>
                ))}
              </div>
            </div>

            <div>
              <div className='flex gap-2'>
                <h3 className='font-semibold mb-3'>Brand:</h3>
                <span className='capitalize'>{product?.brand}</span>
              </div>

              <div className='flex gap-2'>
                <h3 className='font-semibold mb-3'>Category:</h3>
                <span className='capitalize'>{product?.category}</span>
              </div>
            </div>

            <div>
              <h3 className='font-semibold mb-3'>Description:</h3>
              <p>{product?.description}</p>
            </div>

            <div>
              <h3 className='font-semibold mb-3'>Quantity:</h3>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center border rounded-lg border-gray-300'>
                  <button
                    onClick={() => setQuantity((pre) => (pre === 1 ? 1 : pre - 1))}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                    -
                  </button>
                  <button className='px-4 text-center border-x border-gray-300'>{quantity}</button>
                  <button
                    onClick={() =>
                      setQuantity((pre) => (pre === product?.stock ? product?.stock : pre + 1))
                    }
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                    +
                  </button>
                </div>
                <span className='text-sm '>
                  {Number(product?.stock) - Number(quantity)} items available
                </span>
              </div>
            </div>

            <div className='flex space-x-4'>
              <Button
                onClick={() => handleAddToCart(product?._id || '', quantity)}
                name='Add to cart'
                icon={<ShoppingCart size={16} />}
                className='bg-indigo-600 text-white !text-base'
              />

              <HeartFavorite
                id={product?._id || ''}
                name='Favorite'
                className='flex items-center gap-2.5 border px-3 rounded-lg'
              />
            </div>
          </div>
        </div>
      </div>

      <CommentListing />

      <Trending size={4} heading='Related Products' />
    </section>
  );
};

export default SingleProductPage;
