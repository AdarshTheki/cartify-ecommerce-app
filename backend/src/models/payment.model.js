import { Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
