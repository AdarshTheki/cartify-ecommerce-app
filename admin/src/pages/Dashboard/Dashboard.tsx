import { Counter, Select, Skeleton } from '@/components/ui';
import { useFetch } from '@/hooks';
import { cn } from '@/lib/utils';
import { Box, CircleDollarSign, ShoppingBag, Users } from 'lucide-react';
import React, { useState } from 'react';

interface DashboardProps {
  totalUsers: number;
  lastMonthUser: number;
  totalProducts: number;
  lastMonthProduct: number;
  totalOrders: number;
  lastMonthOrder: number;
  totalRevenues: number;
  lastMonthRevenue: number;
}

type DashboardStatCardProps = {
  title: string;
  value?: number;
  lastMonthValue?: number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  isCurrency?: boolean;
};

const Dashboard = () => {
  const [select, setSelected] = useState('last-30-days');
  const { data, loading } = useFetch<DashboardProps>(
    `/dashboard/totals?date=${select}`
  );

  const percentageCalculate = (
    lastMonthValue: number,
    totalValue: number
  ): number => {
    if (!lastMonthValue || !totalValue) return 0;
    return parseFloat(((lastMonthValue / totalValue) * 100).toFixed(1));
  };

  return (
    <div>
      <div className="flex items-center pb-6 justify-between">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <Select
          className="min-w-[150px] right-0"
          selected={select}
          onSelected={(e) => setSelected(e)}
          list={['last-30-days', 'last-3-month', 'last-6-month', 'last-year']}
        />
      </div>

      {!!loading || !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-4 md:grid-cols-3">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border animate-pulse bg-white">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2 w-full pr-5">
                  <Skeleton className="h-4 bg-gray-100 rounded" />
                  <Skeleton className="h-7 bg-gray-100 rounded" />
                  <Skeleton className="h-4 bg-green-100 rounded" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <Skeleton className="h-7 w-7 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-4 md:grid-cols-3">
          <DashboardStatCard
            title="Total Revenue"
            value={data?.lastMonthRevenue}
            lastMonthValue={percentageCalculate(
              data?.lastMonthRevenue,
              data?.totalRevenues
            )}
            icon={<CircleDollarSign size={28} />}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            isCurrency
          />

          <DashboardStatCard
            title="Total Orders"
            value={data?.lastMonthOrder}
            lastMonthValue={percentageCalculate(
              data?.lastMonthOrder,
              data?.totalOrders
            )}
            icon={<ShoppingBag size={28} />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <DashboardStatCard
            title="Total Products"
            value={data?.lastMonthProduct || 384}
            lastMonthValue={percentageCalculate(
              data?.lastMonthProduct,
              data?.totalProducts
            )}
            icon={<Box size={28} />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />

          <DashboardStatCard
            title="Total Customers"
            value={data?.lastMonthUser || 1234}
            lastMonthValue={percentageCalculate(
              data?.lastMonthUser,
              data?.totalUsers
            )}
            icon={<Users size={28} />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value = 10,
  lastMonthValue = 4,
  icon,
  iconColor,
  isCurrency,
}) => {
  return (
    <div className="p-4 rounded-lg border shadow">
      <div className="flex flex-col gap-2 justify-start">
        <p className="text-sm text-slate-800">{title}</p>
        <h3 className="text-2xl font-semibold flex items-center justify-between">
          {isCurrency && '$'}
          <Counter target={value} />
          <span className={cn(iconColor)}>{icon}</span>
        </h3>
        <p className="text-green-500 text-sm">
          +
          <Counter target={lastMonthValue} />% from last month
        </p>
      </div>
    </div>
  );
};
