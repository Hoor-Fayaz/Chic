const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional — guests can also review
      index: true,
    },
    // Guest reviewer fields (used when user is not logged in)
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Only enforce one review per user per product for logged-in users
// Guests can submit multiple (limited by email check in service)
reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true, sparse: true } // sparse means nulls are ignored in uniqueness check
);

module.exports = mongoose.model('Review', reviewSchema);

