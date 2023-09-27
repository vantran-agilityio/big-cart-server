// Libraries
import bodyParser from 'body-parser';
import express from 'express';

// Controller
import { signInController } from 'src/controllers/authentication';

// Validator
import { signInValidator } from 'src/validators/authentication';

const signInRouter = express.Router();

signInRouter
  .use(bodyParser.json())
  .post('/', signInValidator.signIn, signInController.signIn);

export { signInRouter };
