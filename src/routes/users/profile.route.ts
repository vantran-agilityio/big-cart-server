// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { profileController } from 'src/controllers/users';

// Validator
import { profileValidator } from 'src/validators/users';

const profileRouter = express.Router();

profileRouter.get(
  '/:userId/profile',
  passport.authenticate('jwt-auth', { session: false }),
  profileValidator.getUserProfile,
  profileController.getUserProfile
);

profileRouter
  .use(bodyParser.json())
  .patch(
    '/:userId/profile',
    passport.authenticate('jwt-auth', { session: false }),
    profileValidator.updateUserProfile,
    profileController.updateUserProfile
  );

export { profileRouter };
