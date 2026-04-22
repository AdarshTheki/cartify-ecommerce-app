import { type ProductStatus } from './index';

export interface Product {
  _id: string;
  status: ProductStatus;
  title: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: [string];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
