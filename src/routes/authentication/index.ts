// Libraries
import express from 'express';

// Routes
import { signInRouter } from './sign-in.route';
import { signUpRouter } from './sign-up.route';
import { activateAccountRouter } from './activate-account.route';
import { resendActivateOTPRouter } from './resend-activate-otp.route';

const authenticationRouter = express.Router();

// Authentication Router
authenticationRouter.use('/sign-in', signInRouter);
authenticationRouter.use('/sign-up', signUpRouter);
authenticationRouter.use('/activate-account', activateAccountRouter);
authenticationRouter.use('/resend-activate-otp', resendActivateOTPRouter);

export { authenticationRouter };
