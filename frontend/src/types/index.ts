import { type UserActivity } from './UserActivity';
import { type User } from './User';
import { type Address } from './Address';
import { type AuthState } from './AuthState';
import { type Product } from './Product';
import { type Payment } from './Payment';
import { type Image } from './Image';
import { type Category } from './Category';
import { type Chat } from './Chat';
import { type Message } from './Message';
import { type Order } from './Order';
import { type Pagination } from './Pagination';
import { type Review } from './Review';
import { type Category as Brand } from './Category';
import type { CartItem, CartList } from './Cart';
import type { TableColumn, TableQuery, TableData } from './Table';
import type { Comment, Reply, Report } from './Comment';

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type ProductStatus = 'active' | 'inactive' | 'out-of-stock' | 'pending';
export type UserRole = 'customer' | 'admin' | 'seller';
export type Status = 'active' | 'inactive';

export type UserFormData = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type AddressFormData = Omit<Address, '_id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type ProductFormData = Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type BrandFormData = Omit<Brand, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type CategoryFormData = Omit<Category, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

export type {
  UserActivity,
  User,
  Address,
  AuthState,
  Product,
  Category,
  Brand,
  CartItem,
  CartList,
  Payment,
  Order,
  Image,
  Chat,
  Message,
  TableColumn,
  TableQuery,
  TableData,
  Pagination,
  Comment,
  Reply,
  Report,
  Review,
};

export interface AI {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  likes: [string];
  createdBy: User;
  prompt: string;
  response: string;
  publish: boolean;
  model: string;
}
