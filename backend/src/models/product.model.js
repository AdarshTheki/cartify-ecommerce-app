import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: 3,
      maxlength: 100,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out-of-stock', 'pending'],
      default: 'pending',
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Product thumbnail is required'],
      trim: true,
    },
    images: [
      {
        type: String,
        required: [true, 'Product image is required'],
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      minlength: 50,
      maxlength: 1000,
      required: [true, 'Product description is required'],
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
    slug: { type: String, unique: true, index: true },
    isDeleted: { type: Boolean, default: false, select: false },
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

productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
