import { NavLink } from "react-router-dom";
import { ShoppingCart, Trash2Icon } from "lucide-react";
import { Loading, NotFound } from "../utils";
import { HomeCertificate } from "../components";
import { useEffect, useState } from "react";
import { axios, errorHandler } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import Trending from "./Home/Trending";
import { fetchCarts, removeItem, updateItemQuantity } from "../redux/cartSlice";

const ShoppingCartPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  const handleCheckout = async () => {
    try {
      const res = await axios.post("/order/stripe-checkout");
      if (res.data) {
        window.location.href = res.data?.data?.url;
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleUpdateQty = async (id, productId, quantity) => {
    try {
      const res = await axios.put("/cart", { productId, quantity });
      if (res.data) {
        dispatch(updateItemQuantity({ _id: id, quantity }));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const res = await axios.delete(`/cart/${id}`);
      if (res.data) {
        dispatch(removeItem(id));
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const totals =
    (items &&
      items
        ?.reduce((p, c) => c?.productId?.price * c?.quantity + p, 0)
        ?.toFixed(2)) ||
    0;

  if (loading) return <Loading />;

  return (
    <section className="min-h-screen mx-auto container px-2">
      {items?.length === 0 && (
        <NotFound
          canvas={
            <ShoppingCart className="w-20 h-20 text-gray-400 mb-4 mx-auto" />
          }
          title="Your cart is empty"
          description="Looks like you haven’t added anything to your cart yet."
          linkName="Start Shopping"
          linkClass="bg-indigo-600"
          linkTo="/products"
          mainClass="min-h-[100px]"
        />
      )}
      <div className="flex max-sm:flex-col gap-5">
        <div className="md:flex-1 w-full">
          {items &&
            items?.map((item) => {
              if (!item?.productId) return null;
              return (
                <CartListing
                  key={item._id}
                  {...item}
                  onQtyChange={(qty) =>
                    handleUpdateQty(item._id, item.productId._id, qty)
                  }
                  onRemove={() => handleRemoveItem(item._id)}
                />
              );
            })}

          {!!items?.length && (
            <div className="flex gap-6 font-semibold mt-10 ">
              <NavLink
                to={"/product"}
                className="text-red-600 btn !text-base text-nowrap border">
                Go Product
              </NavLink>
              <button
                onClick={handleCheckout}
                className="bg-indigo-600 text-white btn">
                Checkout Payment
              </button>
            </div>
          )}
        </div>

        {!!items?.length && (
          <div className="p-4 md:w-1/3 space-y-3 w-full sticky top-20 h-fit">
            <h3>This Order shipping Fee!</h3>
            <div className="flex justify-between font-semibold text-xl">
              <span>({items?.length}) Item</span>
              <span>${totals}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Estimate Tax:</span>
              <span className="text-red-600">$5</span>
            </div>
            <div className="flex justify-between font-semibold text-3xl">
              <span>Total:</span>
              <span>${parseInt(totals) + 5}</span>
            </div>
          </div>
        )}
      </div>

      <HomeCertificate />

      <Trending heading="Suggest you Wishlist" size={4} />
    </section>
  );
};

export default ShoppingCartPage;

const CartListing = ({ productId, quantity, onRemove, onQtyChange }) => {
  const { _id, thumbnail, title, price, category, brand } = productId;
  const [qty, setQty] = useState(quantity);

  return (
    <div className="flex max-sm:flex-col gap-5 items-start border-b text-slate-700 border-gray-300 py-4">
      <NavLink to={`/products/${_id}`} className="bg-gray-300 max-sm:w-full">
        <img
          src={thumbnail || "https://placehold.co/120x120"}
          alt="Product"
          className="w-[200px] mx-auto object-cover rounded transition-opacity duration-300 opacity-100"
        />
      </NavLink>
      <div className="sm:flex-1 max-sm:px-4 w-full space-y-2 capitalize">
        <p className="font-medium text-lg">{title || "Smartphone X Pro"}</p>
        <p>Category : {category || "other"}</p>
        <p>Brand: {brand || "other"}</p>
        <div className="flex items-center my-1">
          <span>Unit Price:</span>
          <span className="ml-2 font-semibold">
            ${price || 79.99} x {qty}
          </span>
        </div>
        <p>
          Totals: <span className="font-bold">${(price * qty).toFixed(2)}</span>
        </p>
        <div className="flex gap-5 items-center mt-3">
          <div className="py-1 gap-6 flex items-center justify-center px-6 border border-slate-300 rounded-full w-fit font-medium">
            <button
              className="text-center text-xl"
              onClick={() => {
                if (qty !== 1) {
                  onQtyChange(qty - 1);
                  setQty((prev) => prev - 1);
                }
              }}>
              -
            </button>
            <button className="text-center">{qty}</button>
            <button
              className="text-center text-xl"
              onClick={() => {
                if (qty < 5) {
                  onQtyChange(qty + 1);
                  setQty((prev) => prev + 1);
                }
              }}>
              +
            </button>
          </div>
          <button onClick={onRemove} className="text-red-600 svg-btn !p-2">
            <Trash2Icon />
          </button>
        </div>
      </div>
    </div>
  );
};
