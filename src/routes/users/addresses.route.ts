// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { addressesController } from 'src/controllers/users';

// Validator
import { addressesValidator } from 'src/validators/users';

const addressesRouter = express.Router();

addressesRouter.get(
  '/:userId/addresses',
  passport.authenticate('jwt-auth', { session: false }),
  addressesValidator.getUserAddresses,
  addressesController.getUserAddresses
);

addressesRouter
  .use(bodyParser.json())
  .post(
    '/:userId/addresses',
    passport.authenticate('jwt-auth', { session: false }),
    addressesValidator.addUserAddress,
    addressesController.addUserAddress
  );

addressesRouter
  .use(bodyParser.json())
  .patch(
    '/:userId/addresses/:addressId',
    passport.authenticate('jwt-auth', { session: false }),
    addressesValidator.updateUserAddress,
    addressesController.updateUserAddress
  );

addressesRouter.delete(
  '/:userId/addresses/:addressId',
  passport.authenticate('jwt-auth', { session: false }),
  addressesValidator.deleteUserAddress,
  addressesController.deleteUserAddress
);

export { addressesRouter };
