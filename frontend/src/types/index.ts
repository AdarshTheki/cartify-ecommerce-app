export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type ProductStatus = 'active' | 'inactive' | 'out-of-stock' | 'pending';
export type UserRole = 'customer' | 'admin' | 'seller';
export type Status = 'active' | 'inactive';

export interface UserActivity {
  userId: string;
  productId: string;
  action: 'view' | 'cart' | 'like' | 'purchase';
  createdAt: Date;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: Status;
  avatar: string;
  phoneNumber: string;
  favorite: [string];
  password?: string;
  isEmailVerified?: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Address {
  _id: string;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: number;
  isDefault: boolean;
  addressLine2?: string;
}

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
  createdBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Brand {
  _id: string;
  status: Status;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User | null;
}

export interface Category {
  _id: string;
  status: Status;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User | null;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

export interface CartState {
  _id: string;
  items: CartItem[];
  wishlist: CartItem[];
  createdBy: User | null;
}

export interface Order {
  _id: string;
  customer: string | User;
  totalPrice: number;
  status: OrderStatus;
  items: CartItem[];
  payment: {
    id: string;
    status: string;
    method: string;
  };
  shipping_address: Address;
  createdAt: string;
  updatedAt: string;
}

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
  createdBy: User;
  text: string;
  likes: string[];
  replies: Reply[];
  reports: Report[];
}

export interface Cloudinary {
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

export interface Message {
  _id: string;
  sender: User;
  chat: Chat;
  content: string;
  attachments: [string];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  name: string;
  isGroupChat: boolean;
  lastMessage: Message;
  participants: User[];
  admin: User;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AIResponse {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  likes: [string];
  createdBy: UserType;
  prompt: string;
  response: string;
  publish: boolean;
  model: string;
}

export interface TableQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  select?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Pagination<T> {
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

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;

  // server controls
  totalDocs: number;
  page: number;
  limit: number;

  onPageChange: (page: number) => void;
  onSort: (key: string) => void;
}

export interface Image {
  _id: string;
  title: string;
  description?: string;
  url: string; // Cloudinary secure_url
  publicId: string; // Cloudinary public_id
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  tags: string[];
  uploadedBy: string;
  likes: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
