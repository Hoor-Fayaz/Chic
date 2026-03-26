"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createProductReview } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import Link from "next/link";

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  if (!user) {
    return (
      <div className="bg-gray-50/50 p-8 rounded-[2rem] text-center border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium mb-4">Please log in to write a review</p>
        <Link 
            href="/auth/login" 
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-sm"
        >
          Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return showToast("Please select a rating", "info");
    
    setLoading(true);
    try {
      await createProductReview(productId, { rating, comment, title });
      showToast("Thank you for your review!", "success");
      setComment("");
      setTitle("");
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      showToast(err?.message || "Failed to submit review", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h3 className="text-xl font-display font-bold mb-6 tracking-tight text-gray-900">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Rating</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform active:scale-90"
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-transparent px-5 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300 text-sm"
              placeholder="Summary of your experience"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-50 border border-transparent px-5 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300 min-h-[120px] text-sm"
              placeholder="What did you like or dislike?"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 disabled:bg-gray-300 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
