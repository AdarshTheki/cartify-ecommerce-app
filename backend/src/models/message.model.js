import mongoose from 'mongoose';

// TODO: Add image and pdf file sharing in the next version
const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    content: String,
    attachments: [String],
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', chatMessageSchema);
