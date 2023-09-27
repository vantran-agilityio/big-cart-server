// Libraries
import bodyParser from 'body-parser';
import express from 'express';

// Controller
import { signUpController } from 'src/controllers/authentication';

// Validator
import { signUpValidator } from 'src/validators/authentication';

const signUpRouter = express.Router();

signUpRouter
  .use(bodyParser.json())
  .post('/', signUpValidator.signUp, signUpController.signUp);

export { signUpRouter };
