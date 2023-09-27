// Libraries
import bodyParser from 'body-parser';
import passport from 'passport';
import express from 'express';

// Controller
import { favoriteItemsController } from 'src/controllers/users';

// Validator
import { favoriteItemsValidator } from 'src/validators/users';

const favoriteItemsRouter = express.Router();

favoriteItemsRouter.get(
  '/:userId/favorite-items',
  passport.authenticate('jwt-auth', { session: false }),
  favoriteItemsValidator.getUserFavoriteItems,
  favoriteItemsController.getUserFavoriteItems
);

favoriteItemsRouter
  .use(bodyParser.json())
  .post(
    '/:userId/favorite-items',
    passport.authenticate('jwt-auth', { session: false }),
    favoriteItemsValidator.addUserFavoriteItem,
    favoriteItemsController.addUserFavoriteItem
  );

favoriteItemsRouter.delete(
  '/:userId/favorite-items/:favoriteItemId',
  passport.authenticate('jwt-auth', { session: false }),
  favoriteItemsValidator.deleteUserFavoriteItem,
  favoriteItemsController.deleteUserFavoriteItem
);

export { favoriteItemsRouter };
