import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';

const lovedByCreators = [
  {
    id: 1,
    name: 'John Doe',
    title: 'Marketing Director, TechCorp',
    content:
      'ContentAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
    rating: 4,
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Content Creator, TechCorp',
    content:
      'ContentAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Lee',
    title: 'Content Writer, TechCorp',
    content:
      'ContentAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Emily Johnson',
    title: 'Social Media Manager, Brandify',
    content:
      'Our team loves ContentAI! Scheduling and writing posts is so much smoother now, and the engagement boost has been incredible.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Michael Brown',
    title: 'Freelance Blogger',
    content:
      'As a freelancer, ContentAI saves me tons of time researching and drafting. I can now focus on personalizing my work instead of starting from scratch.',
    rating: 4,
  },
  {
    id: 6,
    name: 'Sophia Martinez',
    title: 'SEO Specialist, RankPro',
    content:
      'ContentAI is a game-changer for SEO teams. The keyword optimization and content structure tools are spot-on and deliver results fast.',
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <div className=' container mx-auto'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-3xl mb-4 font-semibold'>Loved by Creators</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>
      <div className='mt-8 gap-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'>
        {lovedByCreators.slice(0, 4).map((testimonial) => (
          <div
            key={testimonial.id}
            className='p-6 w-full rounded-lg bg-white/40 shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer'>
            <div className='flex items-center gap-1'>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    fill={i < testimonial.rating ? '#4f39f6' : '#fff'}
                    key={i}
                    className='w-4 h-4 text-[#4f39f6]'
                  />
                ))}
            </div>
            <p className='text-gray-500 text-sm my-5 line-clamp-4'>"{testimonial.content}"</p>
            <hr className='mb-5 border-gray-300' />
            <div className='flex items-center gap-4'>
              <Avatar>
                <AvatarFallback>{testimonial.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className='text-sm text-gray-600'>
                <h3 className='font-medium'>{testimonial.name}</h3>
                <p className='text-xs text-gray-500'>{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
