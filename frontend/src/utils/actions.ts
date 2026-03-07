import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { differenceInDays, format, isToday, isYesterday } from 'date-fns';

export const errorHandler = (error: AxiosError) => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response) {
      toast.error(`${axiosError.response.data.message || axiosError.response.statusText}`);
    } else if (axiosError.request) {
      toast.error('No response received from server');
    } else {
      toast.error(`Error: ${axiosError.message}`);
    }
  } else {
    toast.error('An unexpected error occurred.');
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 50000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken')}`,
  },
});

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

export const downloadOrdersAsCSV = (orders: OrderType[], filename = 'orders') => {
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
      customer: order.customer,
      status: order.status,
      payment_id: order.payment?.id || '',
      payment_status: order.payment?.status || '',
      payment_method: order.payment?.method || '',
      shipping_name: order.shipping_address.name,
      shipping_email: order.shipping_address.email,
      shipping_line1: order.shipping_address.line1,
      shipping_line2: order.shipping_address.line2 || '',
      shipping_city: order.shipping_address.city,
      shipping_state: order.shipping_address.state,
      shipping_country: order.shipping_address.country,
      shipping_postal: order.shipping_address.postal_code,
      item_count: order.items.length.toString(),
      item_ids: itemIds,
      item_quantities: itemQuantities,
    };
    return headers.map((h) => `"${String((flat as any)[h] ?? '').replace(/"/g, '""')}"`).join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  blobDownload(csv, filename);
};

export const downloadProductsAsCSV = (products: ProductType[], filename = 'products') => {
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

export const downloadCategoriesAsCSV = (categories: CategoryType[], filename = 'categories') => {
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

export const formateTime = (date: string): string => {
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
