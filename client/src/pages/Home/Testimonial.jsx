import { Star } from 'lucide-react';
import { lovedByCreators } from '../../assets/assets';
import { Avatar } from '../../utils';

const Testimonial = () => {
  return (
    <div className=" container mx-auto">
      <div className="text-center">
        <h2 className="text-slate-700 text-3xl mb-4 font-semibold">
          Loved by Creators
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>
      <div className="mt-8 gap-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {lovedByCreators.slice(0, 4).map((testimonial) => (
          <div
            key={testimonial.id}
            className="p-6 w-full rounded-lg bg-white/40 shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer">
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    fill={i < testimonial.rating ? '#4f39f6' : '#fff'}
                    key={i}
                    className="w-4 h-4 text-[#4f39f6]"
                  />
                ))}
            </div>
            <p className="text-gray-500 text-sm my-5 line-clamp-4">
              "{testimonial.content}"
            </p>
            <hr className="mb-5 border-gray-300" />
            <div className="flex items-center gap-4">
              <Avatar name={testimonial.name} />
              <div className="text-sm text-gray-600">
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-xs text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
