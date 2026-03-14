import { cn } from '../../utils';

const Skeleton = ({ className = '' }: { className?: string }) => (
  <span className={cn('animate-pulse rounded', className)} />
);

export default Skeleton;
