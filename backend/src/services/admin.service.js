const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Inquiry = require('../models/Inquiry');

/**
 * Get aggregated statistics for the admin dashboard
 */
async function getDashboardStats() {
  const [totalRevenueResult, totalOrders, totalProducts, totalUsers, recentOrders, inquiryStats] = await Promise.all([
    // Total Revenue calculation
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    // Total Orders count
    Order.countDocuments(),
    // Total Active Products count
    Product.countDocuments({ status: 'active' }),
    // Total Registered Users count
    User.countDocuments({ role: 'user' }),
    // Recent 5 orders for activity feed
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
    // WhatsApp Inquiry Stats
    Inquiry.aggregate([
        { $facet: {
            total: [{ $count: "count" }],
            potentialRevenue: [
                { $match: { status: { $ne: 'closed' } } },
                { $group: { _id: null, sum: { $sum: "$potentialRevenue" } } }
            ],
            recent: [
                { $sort: { createdAt: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'product' } },
                { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
            ]
        }}
    ])
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;
  const whatsappLeads = inquiryStats[0]?.total[0]?.count || 0;
  const potentialRevenue = inquiryStats[0]?.potentialRevenue[0]?.sum || 0;
  const recentInquiries = inquiryStats[0]?.recent || [];

  // Calculate monthly growth (optional, simplified for now)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const lastMonthSales = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    whatsappLeads,
    potentialRevenue,
    lastMonthRevenue: lastMonthSales[0]?.total || 0,
    recentOrders,
    recentInquiries
  };
}

/**
 * Get sales data over time for chart display
 */
async function getSalesHistory(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await Order.aggregate([
        { 
            $match: { 
                createdAt: { $gte: startDate },
                status: { $ne: 'cancelled' }
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$total" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    return sales;
}

/**
 * Get homepage CMS settings
 */
async function getHomepageSettings() {
    let settings = await Settings.findOne({ key: 'homepage_cms' });
    if (!settings) {
        // Initial default
        settings = await Settings.create({
            key: 'homepage_cms',
            heroSlides: [
                { imageUrl: 'https://picsum.photos/1200/800?random=b1', title: 'Effortless style for every day.', subtitle: 'New Season • SS\'26', link: '/shop' }
            ]
        });
    }
    return settings;
}

/**
 * Update homepage CMS settings
 */
async function updateHomepageSettings(payload) {
    return Settings.findOneAndUpdate(
        { key: 'homepage_cms' },
        { $set: payload },
        { new: true, upsert: true }
    );
}

module.exports = {
  getDashboardStats,
  getSalesHistory,
  getHomepageSettings,
  updateHomepageSettings
};
