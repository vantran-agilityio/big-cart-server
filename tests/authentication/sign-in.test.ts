// Libraries
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

// Prisma
import { UserStatus } from '@prisma/client';

// Server
import { app } from '../../src/server';

// Utils
import { generateHash } from '../../src/utils';

// Mock
import { prismaMock } from '../prismaMock';

describe('POST /api/v1/authentication/sign-in/', () => {
  describe('status 200', () => {
    it('sign in to system with valid data', async () => {
      const password = 'Example123!@#';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password: generateHash(password).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send({
          email: user.email,
          password: password,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('status 400', () => {
    it('sign in to system without email', async () => {
      const user = {
        password: 'Example123!@#',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            msg: 'Invalid value',
            param: 'email',
            location: 'body',
          },
        ],
      });
    });

    it('sign in to system with invalid email format', async () => {
      const user = {
        email: 'invalid.email.com',
        password: 'Example123!@#',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: user.email,
            msg: 'Invalid value',
            param: 'email',
            location: 'body',
          },
        ],
      });
    });

    it('sign in to system without password', async () => {
      const user = {
        email: 'iloveauth@example.com',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            msg: 'Invalid value',
            param: 'password',
            location: 'body',
          },
        ],
      });
    });

    it('sign in with wrong email or password', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
      };

      await prismaMock.user.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            param: 'common',
            msg: 'Something went wrong during the authentication process. Please try signing in again.',
          },
        ],
      });
    });

    it('sign in to system with unactivated account', async () => {
      const password = 'Example123!@#';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password: generateHash(password).hash,
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/authentication/sign-in/')
        .send({
          email: user.email,
          password: password,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            param: 'common',
            msg: 'This Vinmart account is not active.',
          },
        ],
      });
    });
  });
});
