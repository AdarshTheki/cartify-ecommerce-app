export interface UserActivity {
  userId: string;
  productId: string;
  action: 'view' | 'cart' | 'like' | 'purchase';
  createdAt: Date;
}
