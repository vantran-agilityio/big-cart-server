// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { passwordController } from 'src/controllers/users';

// Validator
import { passwordValidator } from 'src/validators/users';

const passwordRouter = express.Router();

passwordRouter
  .use(bodyParser.json())
  .patch(
    '/:userId/password',
    passport.authenticate('jwt-auth', { session: false }),
    passwordValidator.updateUserPassword,
    passwordController.updateUserPassword
  );

export { passwordRouter };
