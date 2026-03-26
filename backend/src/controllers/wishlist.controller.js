const Wishlist = require('../models/Wishlist');

const normalizeProduct = (p) => ({
  _id: p._id,
  slug: p.slug,
  title: p.title || p.name,
  price: p.price ?? 0,
  images: p.images || [],
});

// GET /api/v1/user/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'products',
        select: '_id slug title name price images',
      });

    const items = wishlist
      ? wishlist.products.map(normalizeProduct)
      : [];

    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('getWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/user/wishlist/toggle
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
    } else {
      const index = wishlist.products.findIndex(
        (id) => String(id) === String(productId)
      );

      if (index > -1) {
        wishlist.products.splice(index, 1);
      } else {
        wishlist.products.unshift(productId);
      }

      await wishlist.save();
    }

    const populated = await wishlist.populate({
      path: 'products',
      select: '_id slug title name price images',
    });

    return res.json({
      success: true,
      data: populated.products.map(normalizeProduct),
    });

  } catch (error) {
    console.error('toggleWishlist error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};