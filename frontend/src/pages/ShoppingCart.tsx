import { ArrowLeft, Loader, ShoppingBag, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Certificate from './Home/Certificate';
import { api, errorHandler } from '../services';
import { Button } from '../components';
import { DataState } from '../components';
import { useApi } from '../hooks';
import { removeFromCart, updateCartQuantity } from '../services/cartService';
import Trending from './Home/Trending';
import type { CartItem, Product } from '../types';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { callApi, data, setData, loading } = useApi<CartItem[]>();

  useEffect(() => {
    callApi('/cart');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const res = await api.post('/order/stripe-checkout');
      if (res.data) {
        window.location.href = res.data?.data?.url;
        setIsLoading(false);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleUpdateQty = async (productId: string, quantity: number) => {
    try {
      const carts = await updateCartQuantity(productId, quantity);
      if (carts) {
        setData(
          (prev) =>
            prev && prev?.map((p) => (p.productId._id === productId ? { ...p, quantity } : p)),
        );
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const cart = await removeFromCart(id);
      if (cart) {
        setData((prev) => prev && prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <DataState data={data} loading={loading || isLoading} error={''}>
      {(carts) => {
        const totalAmount = carts
          .reduce((p, c) => c.productId.price * c.quantity + p, 0)
          .toFixed(1);
        const totalQuantity = carts.reduce((p, c) => c.quantity + p, 0).toFixed(0);
        return (
          <section className='min-h-screen mx-auto container px-2'>
            <div className='flex max-sm:flex-col gap-5'>
              <div className='md:flex-1 w-full'>
                {carts.map((item) => {
                  if (!item?.productId) return null;
                  return (
                    <ShoppingCart
                      key={item._id}
                      onQtyChange={(qty) => handleUpdateQty(item.productId._id, qty)}
                      onRemove={() => handleRemoveItem(item._id)}
                      {...item}
                    />
                  );
                })}

                {!!carts.length && (
                  <div className='flex gap-6 font-semibold mt-10 '>
                    <Button
                      icon={<ArrowLeft size={16} />}
                      onClick={() => navigate('/products')}
                      name='Go to products'
                    />
                    <Button
                      disabled={isLoading}
                      icon={isLoading ? <Loader size={16} /> : <ShoppingBag size={16} />}
                      name='Checkout payment'
                      onClick={handleCheckout}
                      className='bg-indigo-600 text-white hover:opacity-90'
                    />
                  </div>
                )}
              </div>

              {!!carts.length && (
                <div className='p-4 md:w-1/3 space-y-3 w-full sticky top-20 h-fit'>
                  <h3>This Order shipping Fee!</h3>
                  <div className='flex justify-between font-semibold text-xl'>
                    <span>{totalQuantity} Item</span>
                    <span>$ {totalAmount}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Estimate Tax:</span>
                    <span className='text-red-600'>$5</span>
                  </div>
                  <div className='flex justify-between font-semibold text-3xl'>
                    <span>Total:</span>
                    <span>$ {totalAmount + 5}</span>
                  </div>
                </div>
              )}
            </div>

            <Certificate />

            <Trending heading='Suggest you Wishlist' size={4} />
          </section>
        );
      }}
    </DataState>
  );
};

export default ShoppingCartPage;

type ShoppingCartProp = {
  onRemove: () => void;
  onQtyChange: (val: number) => void;
  quantity: number;
  productId: Omit<Product, 'createdBy'>;
};

const ShoppingCart = React.memo(
  ({ onRemove, onQtyChange, productId, quantity }: ShoppingCartProp) => {
    const { _id, thumbnail, title, price, category, brand } = productId;
    const [qty, setQty] = useState<number>(quantity);
    const navigate = useNavigate();

    return (
      <div className='flex max-sm:flex-col gap-5 items-start border-b text-slate-700 border-gray-300 py-4'>
        <div
          onClick={() => navigate(`/products/${_id}`)}
          className='bg-gray-300 max-sm:w-full cursor-pointer'>
          <img
            src={thumbnail || 'https://placehold.co/120x120'}
            alt='Product'
            className='w-[200px] mx-auto object-cover rounded transition-opacity duration-300 opacity-100'
          />
        </div>
        <div className='sm:flex-1 max-sm:px-4 w-full space-y-2 capitalize'>
          <p className='font-medium text-lg'>{title || 'Smartphone X Pro'}</p>
          <p>Category : {category || 'other'}</p>
          <p>Brand: {brand || 'other'}</p>
          <div className='flex items-center my-1'>
            <span>Unit Price:</span>
            <span className='ml-2 font-semibold'>
              ${price || 79.99} x {qty}
            </span>
          </div>
          <p>
            Totals: <span className='font-bold'>${(price * qty).toFixed(2)}</span>
          </p>
          <div className='flex gap-5 items-center mt-3'>
            <div className='py-1 gap-6 flex items-center justify-center px-6 border border-slate-300 rounded-full w-fit font-medium'>
              <button
                className='text-center text-xl'
                onClick={() => {
                  if (qty !== 1) {
                    onQtyChange(qty - 1);
                    setQty((prev) => prev - 1);
                  }
                }}>
                -
              </button>
              <button className='text-center'>{qty}</button>
              <button
                className='text-center text-xl'
                onClick={() => {
                  if (qty < 5) {
                    onQtyChange(qty + 1);
                    setQty((prev) => prev + 1);
                  }
                }}>
                +
              </button>
            </div>
            <button onClick={onRemove} className='text-red-600 svg-btn !p-2'>
              <Trash2Icon />
            </button>
          </div>
        </div>
      </div>
    );
  },
);
