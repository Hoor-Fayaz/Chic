const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name slug images price originalPrice');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

async function getCart(userId) {
  return getOrCreateCart(userId);
}

async function addItem(userId, { productId, size, quantity = 1 }) {
  const product = await Product.findById(productId);
  if (!product || product.status !== 'active') {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      size,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  return getOrCreateCart(userId);
}

async function updateItem(userId, itemIndex, { quantity }) {
  const cart = await getOrCreateCart(userId);

  if (itemIndex < 0 || itemIndex >= cart.items.length) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return getOrCreateCart(userId);
}

async function removeItem(userId, itemIndex) {
  const cart = await getOrCreateCart(userId);

  if (itemIndex < 0 || itemIndex >= cart.items.length) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  return getOrCreateCart(userId);
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};

