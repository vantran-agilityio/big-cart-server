// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { notificationSettingsController } from 'src/controllers/users';

// Validator
import { notificationSettingsValidator } from 'src/validators/users';

const notificationSettingsRouter = express.Router();

notificationSettingsRouter
  .use(bodyParser.json())
  .patch(
    '/:userId/notification-settings',
    passport.authenticate('jwt-auth', { session: false }),
    notificationSettingsValidator.updateUserNotificationSettings,
    notificationSettingsController.updateUserNotificationSettings
  );

export { notificationSettingsRouter };
