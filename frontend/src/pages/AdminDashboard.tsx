import { useTitle } from '../hooks';
import SalesStatistics from './Dashboard/SalesStatistics';
import RecentOrders from './Dashboard/RecentOrders';
import TopProducts from './Dashboard/TopProducts';
import TopCategories from './Dashboard/TopCategories';
import SalesChart from './Dashboard/SalesChart';

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
