import { Skeleton } from '@/components/ui/skeleton';

export const SubjectWisePerformanceCardSkeleton = () => {
  return (
    <div className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full max-w-[500px] rounded-[16px] border-[0.5px] bg-white p-[8px] md:py-[16px]">
      <div className="!border-[rgba(16, 16, 16, 0.15)] pb-[8px] md:border-b md:pb-[16px]">
        <Skeleton className="mx-auto h-[24px] w-[120px] rounded-md" />
      </div>
      <div className="cols-12 grid grid-cols-1 gap-2 p-[16px] md:grid-cols-12 xl:p-0">
        <div className="cols-12 flex items-center justify-center p-1 py-[16px] md:col-span-7 xl:col-span-6">
          <Skeleton className="h-[100px] w-[100px] rounded-full" />
        </div>
        <div className="cols-12 grid grid-cols-1 md:col-span-4 lg:col-span-5">
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
        </div>
      </div>
      <div className="!border-[rgba(16, 16, 16, 0.15)] mt-[15px] flex items-center justify-center border-t pt-[8px] md:pt-[16px]">
        <Skeleton className="h-[16px] w-[180px] rounded-md" />
      </div>
    </div>
  );
};

export const CardCarouselSkeleton = () => {
  return (
    <div className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full rounded-[16px] !border-[0.5px] bg-white p-[16px]">
      <div className="!border-[rgba(16, 16, 16, 0.15)] pb-[8px] md:border-b md:pb-[16px]">
        <Skeleton className="mx-auto h-[24px] w-[120px] rounded-md" />
      </div>
      <div className="cols-12 grid grid-cols-1">
        <div className="cols-12 flex items-center justify-center py-[16px]">
          <Skeleton className="h-[100px] w-[100px] rounded-full" />
        </div>
        <div className="cols-12 grid grid-cols-1 md:col-span-5">
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
          <div className="cols-12 flex items-center justify-between border-b border-dashed border-[rgba(16,16,16,0.15)] py-[12px]">
            <Skeleton className="h-[16px] w-[60px] rounded-md" />
            <Skeleton className="h-[16px] w-[30px] rounded-md" />
          </div>
        </div>
      </div>
      <div className="!border-[rgba(16, 16, 16, 0.15)] mt-[15px] flex items-center justify-center border-t pt-[8px] md:pt-[16px]">
        <Skeleton className="h-[16px] w-[180px] rounded-md" />
      </div>
    </div>
  );
};
