import { Star } from "lucide-react";

export default function ReviewStars({ rating, count, size = 16 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[11px] font-medium text-gray-500 tracking-tight">
          ({count} Review{count !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}
