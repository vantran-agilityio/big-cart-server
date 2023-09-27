// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { categoriesController } from 'src/controllers/catalogue';

// Validator
import { categoriesValidator } from 'src/validators/catalogue';

const categoriesRouter = express.Router();

categoriesRouter.get(
  '/',
  passport.authenticate('jwt-auth', { session: false }),
  categoriesController.getCategoryList
);

categoriesRouter
  .use(bodyParser.json())
  .post(
    '/',
    passport.authenticate('jwt-auth', { session: false }),
    categoriesValidator.createCategory,
    categoriesController.createCategory
  );

export { categoriesRouter };
