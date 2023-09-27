// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { activateAccountController } from 'src/controllers/authentication';

// Validator
import { activeAccountValidator } from 'src/validators/authentication';

const activateAccountRouter = express.Router();

activateAccountRouter
  .use(bodyParser.json())
  .post(
    '/',
    passport.authenticate('jwt-verify-otp', { session: false }),
    activeAccountValidator.activateAccount,
    activateAccountController.activateAccount
  );

export { activateAccountRouter };
