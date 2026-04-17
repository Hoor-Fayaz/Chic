const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

/**
 * Log a new WhatsApp inquiry
 */
async function createInquiry(data) {
  const { productId, userId, name, size, color, quantity } = data;

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found for inquiry tracking');
  }

  const inquiry = await Inquiry.create({
    user: userId || null,
    product: productId,
    name: name || product.name,
    size,
    color,
    quantity: quantity || 1,
    potentialRevenue: (product.price || 0) * (quantity || 1),
    status: 'new'
  });

  return inquiry;
}

/**
 * Get inquiry statistics for admin
 */
async function getInquiryStats() {
    const [totalInquiries, totalPotentialRevenue, recentInquiries] = await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.aggregate([
            { $match: { status: { $ne: 'closed' } } },
            { $group: { _id: null, total: { $sum: '$potentialRevenue' } } }
        ]),
        Inquiry.find()
            .populate('product', 'name price images')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
    ]);

    return {
        totalInquiries,
        totalPotentialRevenue: totalPotentialRevenue[0]?.total || 0,
        recentInquiries
    };
}

module.exports = {
  createInquiry,
  getInquiryStats
};
