const { success } = require('../utils/apiResponse');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require('../services/cart.service');

async function getCartHandler(req, res, next) {
  try {
    const cart = await getCart(req.user._id);
    return success(res, { cart });
  } catch (err) {
    return next(err);
  }
}

async function addToCartHandler(req, res, next) {
  try {
    const { productId, size, quantity } = req.body;
    const cart = await addItem(req.user._id, {
      productId,
      size,
      quantity: Number(quantity) || 1,
    });
    return success(res, { cart }, 'Item added to cart', 201);
  } catch (err) {
    return next(err);
  }
}

async function updateCartItemHandler(req, res, next) {
  try {
    const { index } = req.params;
    const { quantity } = req.body;
    const cart = await updateItem(req.user._id, Number(index), {
      quantity: Number(quantity),
    });
    return success(res, { cart }, 'Cart updated');
  } catch (err) {
    return next(err);
  }
}

async function removeCartItemHandler(req, res, next) {
  try {
    const { index } = req.params;
    const cart = await removeItem(req.user._id, Number(index));
    return success(res, { cart }, 'Item removed from cart');
  } catch (err) {
    return next(err);
  }
}

async function clearCartHandler(req, res, next) {
  try {
    const cart = await clearCart(req.user._id);
    return success(res, { cart }, 'Cart cleared');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCartHandler,
  addToCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
};

