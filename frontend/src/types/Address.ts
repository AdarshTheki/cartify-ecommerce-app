export interface Address {
  _id: string;
  title: string;
  userId: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  landmark: string;
  country: string;
  phoneNumber: number;
  isDefault: boolean;
  addressLine2?: string;
}
