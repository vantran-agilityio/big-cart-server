import { body } from 'express-validator';

const signUp = [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('vi-VN'),
  body('password').isStrongPassword(),
];

export const signUpValidator = { signUp };
