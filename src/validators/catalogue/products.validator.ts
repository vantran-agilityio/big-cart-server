import { param, query, body } from 'express-validator';

const getProductList = [
  query('categoryId').isInt().optional(),
  query('rating').isInt().optional(),
  query('minPrice').isInt().optional(),
  query('maxPrice').isInt().optional(),
  query('sortBy').isString().optional(),
  query('orderBy').isString().optional(),
  query('search').isString().optional(),
  query('page').isInt().optional(),
  query('limit').isInt().optional(),
];

const getProduct = [param('productId').isInt()];

const createProduct = [
  body('categoryId').isInt(),
  body('productUnitId').isInt(),
  body('name').isString(),
  body('price').isInt(),
  body('description').isString(),
  body('quantityStock').isInt(),
  // body("images").isArray(),
];

const getProductReviewList = [param('productId').isInt()];

const createProductReview = [
  // Params
  param('productId').isInt(),
  // Body
  body('rating').isFloat(),
  body('description').isString(),
];

export const productsValidator = {
  getProductList,
  createProduct,
  getProduct,
  getProductReviewList,
  createProductReview,
};
