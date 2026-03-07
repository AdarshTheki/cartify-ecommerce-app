import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out-of-stock', 'pending'],
      default: 'pending',
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: { type: String, required: true, trim: true },
    images: [{ type: String, required: true, trim: true }],
    description: {
      type: String,
      trim: true,
      minlength: 50,
      maxlength: 1000,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({
  title: 'text',
  brand: 'text',
  category: 'text',
});

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model('Product', productSchema);
