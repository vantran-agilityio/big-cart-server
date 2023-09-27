// Libraries
import dotenv from 'dotenv';
import express, { Express } from 'express';
import passport from 'passport';

// Commons
import { middlewarePassportStrategy } from 'src/middlewares/passport.middleware';

// Routes
import { authenticationRouter, catalogueRouter, usersRouter } from 'src/routes';

dotenv.config();

// Apply strategy to passport
passport.initialize();
middlewarePassportStrategy(passport);

const port = process.env.PORT;
const app: Express = express();

// Define static public assets
app.use(express.static('public'));

// Imports all of the routes
app.use('/api/v1/authentication', authenticationRouter);
app.use('/api/v1/catalogue', catalogueRouter);
app.use('/api/v1/users', usersRouter);

if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

export { app };
