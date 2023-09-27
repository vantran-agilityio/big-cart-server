// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { avatarController } from 'src/controllers/users';

// Validator
import { avatarValidator } from 'src/validators/users';

// Middleware
import { multerUploader } from 'src/middlewares/multer.middleware';

const avatarRouter = express.Router();

avatarRouter
  .use(bodyParser.json())
  .patch(
    '/:userId/avatar',
    passport.authenticate('jwt-auth', { session: false }),
    multerUploader.updateUserAvatar,
    avatarValidator.updateUserAvatar,
    avatarController.updateUserAvatar
  );

export { avatarRouter };
