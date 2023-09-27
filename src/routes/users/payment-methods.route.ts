// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { paymentMethodsController } from 'src/controllers/users';

// Validator
import { paymentMethodsValidator } from 'src/validators/users';

const paymentMethodsRouter = express.Router();

paymentMethodsRouter.get(
  '/:userId/payment-methods',
  passport.authenticate('jwt-auth', { session: false }),
  paymentMethodsValidator.getUserPaymentMethods,
  paymentMethodsController.getUserPaymentMethods
);

paymentMethodsRouter
  .use(bodyParser.json())
  .post(
    '/:userId/payment-methods',
    passport.authenticate('jwt-auth', { session: false }),
    paymentMethodsValidator.addUserPaymentMethod,
    paymentMethodsController.addUserPaymentMethod
  );

paymentMethodsRouter.delete(
  '/:userId/payment-methods/:paymentMethodId',
  passport.authenticate('jwt-auth', { session: false }),
  paymentMethodsValidator.deleteUserPaymentMethod,
  paymentMethodsController.deleteUserPaymentMethod
);

export { paymentMethodsRouter };
