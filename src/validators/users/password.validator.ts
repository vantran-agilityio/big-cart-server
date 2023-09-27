import { param, body } from 'express-validator';

const updateUserPassword = [
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
  body('currentPassword').isStrongPassword(),
  body('newPassword')
    .isStrongPassword()
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password cannot be same as current password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
  body('confirmPassword')
    .isStrongPassword()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirm password should be same as new password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
];

export const passwordValidator = { updateUserPassword };
