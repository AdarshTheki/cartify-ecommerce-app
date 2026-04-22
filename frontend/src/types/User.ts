export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  phoneNumber: string;
  password?: string;
  favorite: [string];
  isEmailVerified?: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
