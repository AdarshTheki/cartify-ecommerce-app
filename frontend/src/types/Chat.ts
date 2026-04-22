import type { User, Message } from './index';

export interface Chat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  lastMessage: Message;
  participants: User[];
  admin: User;
  createdAt: Date;
  updatedAt: Date;
}
