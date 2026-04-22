export interface Category {
  _id: string;
  status: 'active' | 'inactive';
  title: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
