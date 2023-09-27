import { body } from 'express-validator';

const createCategory = [
  body('name').isString(),
  // body("image").isString(),\
];

export const categoriesValidator = { createCategory };
