const { success } = require('../utils/apiResponse');
const {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/product.service');

async function getProducts(req, res, next) {
  try {
    const result = await listProducts(req.query);
    return success(res, result);
  } catch (err) {
    return next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return success(res, { product });
  } catch (err) {
    return next(err);
  }
}

async function createProductHandler(req, res, next) {
  try {
    const product = await createProduct(req.body);
    return success(res, { product }, 'Product created', 201);
  } catch (err) {
    return next(err);
  }
}

async function updateProductHandler(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    return success(res, { product }, 'Product updated');
  } catch (err) {
    return next(err);
  }
}

async function deleteProductHandler(req, res, next) {
  try {
    const product = await deleteProduct(req.params.id);
    return success(res, { product }, 'Product deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
};

