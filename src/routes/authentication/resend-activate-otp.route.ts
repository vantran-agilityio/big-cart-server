// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { resendActivateOTPController } from 'src/controllers/authentication';

const resendActivateOTPRouter = express.Router();

resendActivateOTPRouter
  .use(bodyParser.json())
  .post(
    '/',
    passport.authenticate('jwt-verify-otp', { session: false }),
    resendActivateOTPController.resendActivateOTP
  );

export { resendActivateOTPRouter };
