// components/ui/skeleton.tsx
import React from 'react';

type SkeletonProps = {
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded ${className}`} />
);

export default Skeleton;
