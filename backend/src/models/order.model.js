import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const orderStatus = ['pending', 'shipped', 'delivered', 'cancelled'];

const orderSchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: orderStatus,
      default: 'pending',
    },
    shipping_address: {
      name: String,
      email: String,
      line1: String,
      line2: String,
      city: String,
      country: String,
      postal_code: String,
      state: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],
    payment: {
      id: String,
      status: String,
      method: String,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongoosePaginate);

export const Order = mongoose.model('Order', orderSchema);
