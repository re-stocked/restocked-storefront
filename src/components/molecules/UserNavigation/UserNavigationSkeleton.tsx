import { Card } from '@/components/atoms';

export const UserPageSkeleton = () => {
  return (
    <div className="flex gap-6">
      <Card className="h-min animate-pulse border-none bg-secondary">
        {Array.from({length: 8}).map((_, index) => (
          <div key={index} className="my-3 flex items-center justify-between px-4 py-3 md:my-0" />
        ))}
      </Card>
      <div className="flex flex-col gap-2">
        <div className="h-10 w-full animate-pulse rounded-sm bg-secondary" />
        <div className="h-10 w-full animate-pulse rounded-sm bg-secondary" />
      </div>
    </div>
  );
};
