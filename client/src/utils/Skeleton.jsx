import React from 'react';
import { classNames } from '../config';

const Skeleton = ({ width, height, circle = false, className }) => {
  return (
    <div
      className={classNames(
        'animate-pulse bg-gray-300',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

export default Skeleton;
