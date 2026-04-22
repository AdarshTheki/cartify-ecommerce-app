import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema({
  title: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDefault: { type: Boolean, default: false },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  landmark: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: {
    type: Number,
    required: true,
    min: 1000000000,
    max: 9999999999,
  },
  addressLine2: String,
});

export const Address = mongoose.model('Address', addressSchema);
