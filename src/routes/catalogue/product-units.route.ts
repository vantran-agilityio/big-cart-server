// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { productUnitsController } from 'src/controllers/catalogue';

// Validator
import { productUnitsValidator } from 'src/validators/catalogue';

const productUnitsRouter = express.Router();

productUnitsRouter.get(
  '/',
  passport.authenticate('jwt-auth', { session: false }),
  productUnitsController.getProductUnitList
);

productUnitsRouter
  .use(bodyParser.json())
  .post(
    '/',
    passport.authenticate('jwt-auth', { session: false }),
    productUnitsValidator.createProductUnit,
    productUnitsController.createProductUnit
  );

export { productUnitsRouter };
