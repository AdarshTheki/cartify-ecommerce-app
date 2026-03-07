/// <reference types="vite/client" />

enum OrderStatusEnum {
  pending = 'pending',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

enum UserRoleEnum {
  customer = 'customer',
  admin = 'admin',
  seller = 'seller',
}

enum StatusEnum {
  active = 'active',
  inactive = 'inactive',
}

enum ProductStatusEnum {
  active = 'active',
  inactive = 'inactive',
  outOfStock = 'out-of-stock',
  pending = 'pending',
}

interface UserActivityType {
  userId: ObjectId;
  productId: ObjectId;
  action: 'view' | 'cart' | 'like' | 'purchase';
  createdAt: Date;
}

interface PaginationType<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface UserType {
  _id: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRoleEnum;
  status: StatusEnum;
  avatar: string;
  phoneNumber: string;
  favorite: [string];
  refreshToke: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isEmailVerified?: boolean;
}

interface AddressType {
  _id: string;
  createdBy: UserType | string;
  status: StatusEnum;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
}

interface ProductType {
  _id: string;
  status: ProductStatusEnum;
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
  createdBy: UserType | string;
  createdAt: Date;
  updatedAt: Date;
}

interface BrandType {
  _id: string;
  status: StatusEnum;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserType | string;
}

interface CategoryType {
  _id: string;
  status: StatusEnum;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserType | string;
}

interface ItemsType {
  productId: string;
  quantity: number;
  product?: ProductType;
}

interface OrderType {
  _id: string;
  customer: string;
  totalPrice: number;
  status: OrderStatus;
  items: ItemsType[];
  payment: {
    id: string;
    status: string;
    method: string;
  };
  shipping_address: ShippingAddressType;
  createdAt: string;
  updatedAt: string;
}

interface ShippingAddressType {
  name: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  country: string;
  postal_code: string;
  state: string;
}
