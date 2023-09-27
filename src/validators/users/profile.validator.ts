import { param, body } from 'express-validator';

const getUserProfile = [
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
];

const updateUserProfile = [
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
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('vi-VN'),
  body('name').isString(),
];

export const profileValidator = { getUserProfile, updateUserProfile };
