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
