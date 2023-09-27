import { param, body } from 'express-validator';

const updateUserAvatar = [
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
];

export const avatarValidator = {
  updateUserAvatar,
};
