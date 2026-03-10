import { useTitle } from '../../hooks';
import SalesStatistics from './SalesStatistics';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import TopCategories from './TopCategories';
import SalesChart from './SalesChart';

const Page = () => {
  useTitle(`Cartify: Dashboard`);

  return (
    <div className='grid grid-cols-1 gap-6'>
      <SalesStatistics />
      <SalesChart />
      <TopProducts />
      <RecentOrders />
      <TopCategories />
    </div>
  );
};

export default Page;
