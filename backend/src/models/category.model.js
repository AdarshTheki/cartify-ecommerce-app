import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const categorySchema = new Schema(
  {
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    title: {
      type: String,
      required: true,
      index: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      minlength: 100,
      maxlength: 1000,
      trim: true,
      required: true,
    },
    thumbnail: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ title: 'text' });

categorySchema.plugin(mongoosePaginate);

export const Category = mongoose.model('Category', categorySchema);
