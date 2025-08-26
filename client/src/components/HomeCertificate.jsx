import { LazyImage } from '../utils';

const HomeCertificate = () => {
  const items = [
    {
      id: 1,
      icon: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/company/1/applications/62d53777f5ad942d3e505f77/theme/pictures/free/original/theme-image-1672163850249.png',
      title: '100% Authentic',
      content: 'All our products are directly sourced from brands',
    },
    {
      id: 2,
      icon: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/company/1/applications/62d53777f5ad942d3e505f77/theme/pictures/free/original/theme-image-1672160879402.png',
      title: 'Free Shipping',
      content: 'On all orders above ₹299',
    },
    {
      id: 3,
      icon: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/company/1/applications/62d53777f5ad942d3e505f77/theme/pictures/free/original/theme-image-1672160905809.png',
      title: 'Certified Beauty Advisors',
      content: 'Get expert consultations',
    },
    {
      id: 4,
      icon: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/company/1/applications/62d53777f5ad942d3e505f77/theme/pictures/free/original/theme-image-1672160946022.png',
      title: 'Easy Returns',
      content: 'Hassle-free pick-ups and refunds',
    },
  ];

  return (
    <div className="py-10 mx-auto container">
      <div className="grid bg-pink-100 md:grid-cols-4 grid-cols-2 gap-4 w-full p-6">
        {items.map((item) => (
          <div key={item.id} className="space-y-3">
            <LazyImage src={item.icon} alt={`icon-${item.id}`} width={30} />
            <h4 className="font-medium mt-5">{item.title}</h4>
            <p className="text-xs max-w-[200px]">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCertificate;
