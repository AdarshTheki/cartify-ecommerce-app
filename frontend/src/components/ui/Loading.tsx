import React from 'react';
import Skeleton from './Skeleton';
import { cn } from '../../utils';

const Loading: React.FC = () => {
  return (
    <div className={`flex items-center justify-center min-h-[60vh]`}>
      <div className='flex space-x-2'>
        {Array.from({ length: 3 }, (_, k) => (
          <Skeleton
            key={k}
            className={cn(
              'w-3 h-3 bg-indigo-500 rounded-full animate-pulse delay-100',
              'delay-' + (k * 2 + 100),
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
