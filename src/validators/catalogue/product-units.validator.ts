import { body } from 'express-validator';

const createProductUnit = [body('name').isString()];

export const productUnitsValidator = { createProductUnit };
