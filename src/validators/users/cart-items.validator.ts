import { param, body } from 'express-validator';

const getUserCartItems = [
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

const addUserCartItem = [
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
  body('productId').isInt(),
];

const updateUserCartItem = [
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
  param('cartItemId').isInt(),
  // Body
  body('quantity').isInt({ min: 1 }),
];

const deleteUserCartItem = [
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
  param('cartItemId').isInt(),
];

export const cartItemsValidator = {
  getUserCartItems,
  addUserCartItem,
  updateUserCartItem,
  deleteUserCartItem,
};
