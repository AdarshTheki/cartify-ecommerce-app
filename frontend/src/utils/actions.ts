import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInDays, format, isToday, isYesterday } from 'date-fns';
import type { Category, Chat, Order, Product, User } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SalesChartProp = {
  createdAt: Date;
  totalPrice: number;
};

type GraphPoint = {
  name: string;
  sales: number;
};

export const getSalesPerMonth = (orders: SalesChartProp[]): GraphPoint[] => {
  if (!orders || orders.length === 0) {
    return [{ name: 'No Data', sales: 0 }];
  }

  const now = new Date();
  const currentMonthIndex = now.getMonth(); // e.g., Aug = 7
  const salesPerMonth: Record<number, number> = orders.reduce(
    (acc, order) => {
      const monthIndex = new Date(order.createdAt).getMonth();
      acc[monthIndex] = (acc[monthIndex] || 0) + order.totalPrice;
      return acc;
    },
    {} as Record<number, number>,
  );

  // Build last 12 months, ending at current month
  const graphData: GraphPoint[] = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonthIndex - i + 12) % 12; // backwards
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      new Date(0, monthIndex),
    );
    return {
      name: month,
      sales: Math.floor(salesPerMonth[monthIndex]) || 0,
    };
  }).reverse(); // reverse to show oldest → newest

  return graphData;
};

export const blobDownload = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadOrdersAsCSV = (orders: Order[], filename = 'orders') => {
  const headers = [
    'order_id',
    'createdAt',
    'updatedAt',
    'customer',
    'status',
    'payment_id',
    'payment_status',
    'payment_method',
    'shipping_name',
    'shipping_email',
    'shipping_line1',
    'shipping_line2',
    'shipping_city',
    'shipping_state',
    'shipping_country',
    'shipping_postal',
    'item_count',
    'item_ids',
    'item_quantities',
  ];

  const rows = orders.map((order) => {
    const itemIds = order.items.map((item) => item.productId).join(' | ');
    const itemQuantities = order.items.map((item) => item.quantity).join(' | ');

    const flat = {
      order_id: order._id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: order.userId,
      status: order.status,
      payment_id: order.paymentId.stripeId || '',
      payment_status: order.paymentId.status || '',
      payment_method: order.paymentId.method || '',
      shipping_name: order.addressId.title,
      shipping_line1: order.addressId.addressLine1,
      shipping_line2: order.addressId.addressLine2 || '',
      shipping_city: order.addressId.city,
      shipping_landmark: order.addressId.landmark,
      shipping_country: order.addressId.country,
      shipping_postal: order.addressId.postalCode,
      item_count: order.items.length.toString(),
      item_ids: itemIds,
      item_quantities: itemQuantities,
    };
    return headers.map((h) => `"${String((flat as any)[h] ?? '').replace(/"/g, '""')}"`).join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  blobDownload(csv, filename);
};

export const downloadProductsAsCSV = (products: Product[], filename = 'products') => {
  const headers = [
    '_id',
    'title',
    'category',
    'brand',
    'status',
    'thumbnail',
    'images',
    'price',
    'discount',
    'rating',
    'stock',
    'description',
    'createdAt',
    'updatedAt',
    'createdBy',
  ];

  const rows = products.map((product) => {
    const flat = {
      ...product,
      images: product.images.join(' | '),
      price: product.price.toFixed(2),
      discount: product.discount + '%',
      rating: product.rating.toFixed(1),
      description: product.description.replace(/\n/g, ' ').slice(0, 500),
    };
    return headers.map((h) => `"${String((flat as any)[h] ?? '').replace(/"/g, '""')}"`).join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  blobDownload(csv, filename);
};

export const downloadCategoriesAsCSV = (categories: Category[], filename = 'categories') => {
  const headers = [
    '_id',
    'title',
    'status',
    'description',
    'thumbnail',
    'createdAt',
    'updatedAt',
    'createdBy',
  ];
  const rows = categories.map((category) => {
    return headers
      .map((h) => `"${String((category as any)[h] ?? '').replace(/"/g, '""')}"`)
      .join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  blobDownload(csv, filename);
};

export const formateTime = (date: Date | string): string => {
  const messageDate = new Date(date);
  const now = new Date();
  if (isToday(messageDate)) {
    // Returns "10:45 AM"
    return format(messageDate, 'p');
  }
  if (isYesterday(messageDate)) {
    return 'Yesterday';
  }
  if (differenceInDays(now, messageDate) < 7) {
    // Returns "Tuesday"
    return format(messageDate, 'eeee');
  }
  // Returns "15/09/2024"
  return format(messageDate, 'dd/MM/yyyy');
};

export const getChatObjectMetadata = (
  chat: Chat, // The chat item for which metadata is being generated.
  loggedInUser: User, // The currently logged-in user details.
) => {
  const lastMessage = chat?.lastMessage?.content
    ? chat?.lastMessage?.content
    : chat?.lastMessage
      ? `${chat?.lastMessage?.attachments?.length} attachment${
          chat?.lastMessage.attachments.length > 1 ? 's' : ''
        }`
      : 'No messages yet'; // Placeholder text if there are no messages.

  if (chat?.isGroupChat) {
    // Case: Group chat
    // Return metadata specific to group chats.
    return {
      // Default avatar for group chats.
      avatar: '',
      title: chat.name, // Group name serves as the title.
      description: `${chat?.participants.length} members in the chat`, // Description indicates the number of members.
      lastMessage: chat?.lastMessage
        ? chat?.lastMessage?.sender?.fullName + ': ' + lastMessage
        : lastMessage,
    };
  } else {
    // Case: Individual chat
    // Identify the participant other than the logged-in user.
    const participant = chat?.participants.find((p) => p._id !== loggedInUser?._id);
    // Return metadata specific to individual chats.
    return {
      avatar: participant?.avatar, // Participant's avatar URL.
      title: participant?.fullName, // Participant's username serves as the title.
      description: participant?.email, // Email address of the participant.
      lastMessage,
    };
  }
};

/** Format a number as INR currency (Nagpur locale) */
export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

/** Truncate long strings for table cells / cards */
export const truncate = (str: string, maxLen = 60): string =>
  str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;

/** Capitalise the first letter */
export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Debounce — useful for search inputs */

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 400,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
