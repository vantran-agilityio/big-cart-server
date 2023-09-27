import { body } from 'express-validator';

const activateAccount = [body('otp').isInt().isLength({ min: 6, max: 6 })];

export const activeAccountValidator = { activateAccount };
