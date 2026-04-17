const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    potentialRevenue: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
