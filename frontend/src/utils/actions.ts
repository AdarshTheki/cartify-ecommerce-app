import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInDays, format, isToday, isYesterday } from 'date-fns';

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
      shipping_line1: order.shipping_address.addressLine1,
      shipping_line2: order.shipping_address.addressLine2 || '',
      shipping_city: order.shipping_address.city,
      shipping_state: order.shipping_address.state,
      shipping_country: order.shipping_address.country,
      shipping_postal: order.shipping_address.postalCode,
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
  chat: ChatType, // The chat item for which metadata is being generated.
  loggedInUser: UserType, // The currently logged-in user details.
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
