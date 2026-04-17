"use client";

import { useEffect, useState } from "react";
import { fetchProductReviews } from "@/lib/api";
import ReviewStars from "./ReviewStars";

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export default function ReviewList({ productId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchProductReviews(productId);
        setReviews(data.data?.items || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
        setError("Could not load reviews.");
      } finally {
        setLoading(false);
      }
    };
    if (productId) loadReviews();
  }, [productId, refreshKey]);

  if (loading) return <div className="py-8 font-medium text-gray-400">Loading reviews...</div>;
  if (error) return <div className="py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-10">
      <h3 className="text-xl font-display font-bold tracking-tight text-gray-900 border-b border-gray-100 pb-4">
        Customer Reviews ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500 py-4 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="grid gap-10">
          {reviews.map((review) => (
            <div key={review._id} className="group overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 mb-3">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm tracking-tight capitalize">
                    {review.user
                      ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim()
                      : review.guestName || 'Anonymous'}
                  </p>
                  <ReviewStars rating={review.rating} size={14} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              {review.title && (
                <h4 className="font-bold text-gray-800 text-sm mb-2">{review.title}</h4>
              )}
              
              <p className="text-gray-600 text-[14px] leading-relaxed max-w-2xl break-words">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
