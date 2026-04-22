import { type User } from './User';

export interface Review {
  _id: string;
  productId: string;
  reason: string;
  rating: number;
  createdBy: User;
}
