export interface Payment {
  _id: string;
  stripeId: string;
  amount: number;
  status: string;
  method: string;
}
