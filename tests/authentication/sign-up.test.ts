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

describe('POST /api/v1/authentication/sign-up', () => {
  describe('status 200', () => {
    it('creates a new user with valid data', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
        phone: '0918364535',
      };

      await prismaMock.user.findFirst.mockResolvedValue(null);

      await prismaMock.phone.findFirst.mockResolvedValue(null);

      await prismaMock.user.create.mockResolvedValue({
        id: 1,
        email: user.email,
        password: generateHash(user.password).hash,
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      });

      await prismaMock.userSetting.create.mockResolvedValue({
        id: 1,
        userId: 1,
        enableEmailNotification: false,
        enableOrderNotification: false,
        enableGeneralNotification: true,
      });

      await prismaMock.phone.create.mockResolvedValue({
        id: 1,
        userId: 1,
        phone: user.phone,
      });

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('status 400', () => {
    it('creates a new user without email', async () => {
      const user = {
        password: 'Example123!@#',
        phone: '0918364535',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: undefined,
            msg: 'Invalid value',
            param: 'email',
            location: 'body',
          },
        ],
      });
    });

    it('creates a new user with invalid email format', async () => {
      const user = {
        email: 'invalid.email.com',
        password: 'Example123!@#',
        phone: '0918364535',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
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

    it('creates a new user without phone', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: undefined,
            msg: 'Invalid value',
            param: 'phone',
            location: 'body',
          },
        ],
      });
    });

    it('creates a new user with invalid phone format', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
        phone: '0005',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: user.phone,
            msg: 'Invalid value',
            param: 'phone',
            location: 'body',
          },
        ],
      });
    });

    it('creates a new user without password', async () => {
      const user = {
        email: 'iloveauth@example.com',
        phone: '0918364535',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: undefined,
            msg: 'Invalid value',
            param: 'password',
            location: 'body',
          },
        ],
      });
    });

    it('creates a new user with weak password', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: '123546',
        phone: '0918364535',
      };

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: user.password,
            msg: 'Invalid value',
            param: 'password',
            location: 'body',
          },
        ],
      });
    });
  });

  describe('status 409', () => {
    it('creates a new user with used email', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
        phone: '0918364535',
      };

      await prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        email: user.email,
        password: generateHash(user.password).hash,
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      });

      await prismaMock.phone.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: user.email,
            msg: 'Email already registered',
            param: 'email',
            location: 'body',
          },
        ],
      });
    });

    it('creates a new user with used phone', async () => {
      const user = {
        email: 'iloveauth@example.com',
        password: 'Example123!@#',
        phone: '0918364535',
      };

      await prismaMock.user.findFirst.mockResolvedValue(null);

      await prismaMock.phone.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        phone: user.phone,
      });

      const response = await request(app)
        .post('/api/v1/authentication/sign-up/')
        .send(user);

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).toEqual({
        errors: [
          {
            value: user.phone,
            msg: 'Phone Number already registered',
            param: 'phone',
            location: 'body',
          },
        ],
      });
    });
  });
});
