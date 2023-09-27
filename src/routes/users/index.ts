// Libraries
import express from 'express';

// Routes
import { addressesRouter } from './addresses.route';
import { avatarRouter } from './avatar.route';
import { cartItemsRouter } from './cart-items.route';
import { favoriteItemsRouter } from './favorite-items.route';
import { notificationSettingsRouter } from './notification-settings.route';
import { passwordRouter } from './password.route';
import { paymentMethodsRouter } from './payment-methods.route';
import { profileRouter } from './profile.route';

const usersRouter = express.Router();

usersRouter.use('/', addressesRouter);
usersRouter.use('/', avatarRouter);
usersRouter.use('/', cartItemsRouter);
usersRouter.use('/', favoriteItemsRouter);
usersRouter.use('/', notificationSettingsRouter);
usersRouter.use('/', passwordRouter);
usersRouter.use('/', paymentMethodsRouter);
usersRouter.use('/', profileRouter);

export { usersRouter };
