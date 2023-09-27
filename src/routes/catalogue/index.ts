// Libraries
import express from 'express';

// Routes
import { categoriesRouter } from './categories.route';
import { productsRouter } from './products.route';
import { productUnitsRouter } from './product-units.route';

const catalogueRouter = express.Router();

catalogueRouter.use('/categories', categoriesRouter);
catalogueRouter.use('/products', productsRouter);
catalogueRouter.use('/product-units', productUnitsRouter);

export { catalogueRouter };
