import { body } from 'express-validator';

const signIn = [
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword(),
];

export const signInValidator = { signIn };
