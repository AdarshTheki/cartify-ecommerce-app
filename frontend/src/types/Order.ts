import type { User, CartItem, OrderStatus, Address, Payment } from './index';

export interface Order {
  _id: string;
  userId: User;
  totalPrice: number;
  status: OrderStatus;
  items: CartItem[];
  addressId: Address;
  paymentId: Payment;
  createdAt: string;
  updatedAt: string;
}
