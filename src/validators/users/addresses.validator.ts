import { param, body } from 'express-validator';

const getUserAddresses = [
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

const addUserAddress = [
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
  body('recipientName').isString(),
  body('address').isString(),
  body('city').isString(),
  body('zipCode').isInt(),
  body('country').isString(),
  body('phone').isMobilePhone('vi-VN'),
  body('default').isBoolean(),
];

const updateUserAddress = [
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
  param('addressId').isInt(),
  // Body
  body('recipientName').isString(),
  body('address').isString(),
  body('city').isString(),
  body('zipCode').isInt(),
  body('country').isString(),
  body('phone').isMobilePhone('vi-VN'),
  body('default').isBoolean(),
];

const deleteUserAddress = [
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
  param('addressId').isInt(),
];

export const addressesValidator = {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
