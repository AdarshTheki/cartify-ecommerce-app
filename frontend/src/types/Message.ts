import type { User, Chat } from './index';

export interface Message {
  _id: string;
  sender: User;
  chat: Chat;
  content: string;
  attachments: [string];
  createdAt: Date;
  updatedAt: Date;
}
