const shimmer = 'animate-pulse bg-[#E5E7EB] rounded';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
    <div className={`${shimmer} h-48 rounded-none`} />
    <div className="p-5 space-y-3">
      <div className={`${shimmer} h-4 w-3/4`} />
      <div className={`${shimmer} h-3 w-full`} />
      <div className={`${shimmer} h-3 w-5/6`} />
      <div className={`${shimmer} h-8 w-28 mt-4`} />
    </div>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <div className={`${shimmer} aspect-square rounded-none`} />
    <div className="p-5 space-y-2.5">
      <div className={`${shimmer} h-4 w-3/4`} />
      <div className={`${shimmer} h-3 w-2/3`} />
      <div className={`${shimmer} h-3 w-1/3 mt-3`} />
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`${shimmer} h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const Component = type === 'product' ? ProductCardSkeleton : CardSkeleton;
  return (
    <div className={`grid gap-6 ${count === 4 ? 'grid-cols-2 lg:grid-cols-4' : count === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
      {Array.from({ length: count }).map((_, i) => <Component key={i} />)}
    </div>
  );
};

export default LoadingSkeleton;
