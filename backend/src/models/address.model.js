import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDefault: { type: Boolean, default: false },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: Number,
  name: String,
  addressLine2: String,
});

export const Address = mongoose.model('Address', addressSchema);
