"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createProductReview } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

export default function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return showToast("Please select a rating", "info");

    // Validate guest fields if not logged in
    if (!user) {
      if (!guestName.trim()) return showToast("Please enter your name", "info");
      if (!guestEmail.trim()) return showToast("Please enter your email", "info");
    }

    setLoading(true);
    try {
      const payload = { rating, comment, title };
      if (!user) {
        payload.guestName = guestName;
        payload.guestEmail = guestEmail;
      }
      await createProductReview(productId, payload);
      const submittedRating = rating;
      showToast("Thank you for your review!", "success");
      setComment("");
      setTitle("");
      setRating(5);
      setGuestName("");
      setGuestEmail("");
      if (onReviewAdded) onReviewAdded(submittedRating);
    } catch (err) {
      showToast(err?.message || "Failed to submit review", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h3 className="text-xl font-display font-bold mb-2 tracking-tight text-gray-900">Write a Review</h3>
      <p className="text-[11px] text-gray-400 mb-6">
        {user ? `Posting as ${user.name}` : "No account needed — just fill in your name and email."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Guest fields — shown only when not logged in */}
        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-transparent px-5 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300 text-sm"
                placeholder="e.g. Fatima A."
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address *</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-transparent px-5 py-3.5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-300 text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

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
