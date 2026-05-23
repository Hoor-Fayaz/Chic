"use client";

const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function HeroSkeleton() {
  return (
    <div className={`relative mx-auto grid max-w-[1600px] items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:px-12 lg:py-20 animate-pulse`}>
      <div className="space-y-8">
        <div className={`h-3 w-32 bg-gray-100 rounded-full ${shimmer} relative overflow-hidden`} />
        <div className={`h-16 w-full bg-gray-100 rounded-2xl ${shimmer} relative overflow-hidden`} />
        <div className="space-y-3">
          <div className={`h-4 w-full bg-gray-50 rounded-lg ${shimmer} relative overflow-hidden`} />
          <div className={`h-4 w-2/3 bg-gray-50 rounded-lg ${shimmer} relative overflow-hidden`} />
        </div>
        <div className="flex gap-4 pt-4">
          <div className={`h-12 w-40 bg-gray-200 rounded-full ${shimmer} relative overflow-hidden`} />
          <div className={`h-12 w-32 bg-gray-50 rounded-full ${shimmer} relative overflow-hidden`} />
        </div>
      </div>
      <div className={`relative aspect-[4/5] md:h-[600px] lg:h-[700px] bg-gray-100 rounded-[3rem] md:rounded-[4rem] ${shimmer} relative overflow-hidden`} />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className={`aspect-[4/5] lg:aspect-[2/3] bg-gray-100 rounded-[1.25rem] md:rounded-[2.5rem] ${shimmer} relative overflow-hidden`} />
      <div className="space-y-2 px-2">
        <div className={`h-3 w-20 bg-gray-100 rounded-full ${shimmer} relative overflow-hidden`} />
        <div className={`h-4 w-full bg-gray-50 rounded-md ${shimmer} relative overflow-hidden`} />
        <div className={`h-4 w-24 bg-gray-100 rounded-md ${shimmer} relative overflow-hidden`} />
      </div>
    </div>
  );
}

export function TextSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className={`h-10 w-3/4 bg-gray-100 rounded-xl ${shimmer} relative overflow-hidden`} />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-4 w-full bg-gray-50 rounded-lg ${shimmer} relative overflow-hidden`} />
        ))}
        <div className={`h-4 w-2/3 bg-gray-50 rounded-lg ${shimmer} relative overflow-hidden`} />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
