import { param, body } from 'express-validator';

const updateUserNotificationSettings = [
  // Params
  param('userId')
    .isInt()
    .custom((value, { req }) => {
      if (value !== `${req.user.id}`) {
        throw new Error(
          'You do not have sufficient permission to access this endpoint'
        );
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
  // Body
  body('enableEmailNotification').isBoolean(),
  body('enableOrderNotification').isBoolean(),
  body('enableGeneralNotification').isBoolean(),
];

export const notificationSettingsValidator = {
  updateUserNotificationSettings,
};
