import { param, body } from 'express-validator';

// Model
import { PaymentType } from '@prisma/client';

const getUserPaymentMethods = [
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

const addUserPaymentMethod = [
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
  body('paymentType').custom((value) => {
    if (
      value !== PaymentType.APPLE_PAY &&
      value !== PaymentType.CREDIT_CARD &&
      value !== PaymentType.PAYPAL
    ) {
      throw new Error('This payment type is does not exist');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
];

const deleteUserPaymentMethod = [
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
  param('paymentMethodId').isInt(),
];

export const paymentMethodsValidator = {
  getUserPaymentMethods,
  addUserPaymentMethod,
  deleteUserPaymentMethod,
};
