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
  userId: string;
  productId: string;
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
  role: UserRoleEnum;
  status: StatusEnum;
  avatar: string;
  phoneNumber: string;
  favorite: [string];
  refreshToke: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  password?: string;
  isEmailVerified?: boolean;
}

interface AddressType {
  phone: number;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
  default: boolean;
  status?: StatusEnum;
  _id?: string;
  name?: string;
  email?: string;
  createdBy?: UserType;
  addressLine2?: string;
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
  _id: string;
  productId: ProductType;
  quantity: number;
}

interface OrderType {
  _id: string;
  customer: string;
  totalPrice: number;
  status: OrderStatusEnum;
  items: ItemsType[];
  payment: {
    id: string;
    status: string;
    method: string;
  };
  shipping_address: AddressType;
  createdAt: string;
  updatedAt: string;
}

type ReplyType = {
  createdBy: UserType;
  text: string;
  createdAt: Date;
  _id?: string;
};

type ReportType = {
  createdBy: UserType;
  reason: string;
  reportedAt: Date;
  _id?: string;
};

interface CommentItemType {
  productId: string;
  createdBy: UserType;
  text: string;
  likes: string[];
  replies: ReplyType[];
  reports: ReportType[];
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

interface CloudinaryFileType {
  created_at: string;
  updated_at: string;
  uploaded_at: string;
  public_id: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  type: string;
  tags?: string[];
  filename: string;
  access_mode: string;
  secure_url: string;
  folder: string;
}
