import { type Product } from './Product';

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface CartList {
  _id: string;
  items: CartItem[];
  createdBy: string;
}
