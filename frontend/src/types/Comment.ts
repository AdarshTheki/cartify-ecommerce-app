import { type User } from './User';

export interface Reply {
  _id: string;
  text: string;
  createdBy: User;
  createdAt: Date;
}

export interface Report {
  _id: string;
  reason: string;
  createdBy: User;
  reportedAt: Date;
}

export interface Comment {
  _id: string;
  productId: string;
  text: string;
  likes: string[];
  replies: Reply[];
  reports: Report[];
  createdBy: User;
  createdAt: Date;
}
