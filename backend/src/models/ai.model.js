import mongoose from 'mongoose';

const aiSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    publish: { type: Boolean, default: false },
    model: { type: String, default: 'gpt-4' },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const AIModel = mongoose.model('AIModel', aiSchema);
