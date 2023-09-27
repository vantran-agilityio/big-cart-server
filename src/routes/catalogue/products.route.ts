// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { productsController } from 'src/controllers/catalogue';

// Validator
import { productsValidator } from 'src/validators/catalogue';

const productsRouter = express.Router();

// Product List
productsRouter.get(
  '/',
  passport.authenticate('jwt-auth', { session: false }),
  productsValidator.getProductList,
  productsController.getProductList
);

productsRouter
  .use(bodyParser.json())
  .post(
    '/',
    passport.authenticate('jwt-auth', { session: false }),
    productsValidator.createProduct,
    productsController.createProduct
  );

// Product Detail
productsRouter.get(
  '/:productId',
  passport.authenticate('jwt-auth', { session: false }),
  productsValidator.getProduct,
  productsController.getProduct
);

// Product Reviews
productsRouter.get(
  '/:productId/reviews',
  passport.authenticate('jwt-auth', { session: false }),
  productsValidator.getProductReviewList,
  productsController.getProductReviewList
);

productsRouter
  .use(bodyParser.json())
  .post(
    '/:productId/reviews',
    passport.authenticate('jwt-auth', { session: false }),
    productsValidator.createProductReview,
    productsController.createProductReview
  );

export { productsRouter };
