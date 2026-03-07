import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDefault: { type: Boolean, default: false },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: Number, required: true },
  countryCode: { type: String, required: true },
});

export const Address = mongoose.model('Address', addressSchema);
