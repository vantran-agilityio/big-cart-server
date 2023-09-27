// Libraries
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

// Prisma
import { UserStatus } from '@prisma/client';

// Server
import { app } from '../../src/server';

// Utils
import { generateJWT, generateHash } from '../../src/utils';

// Mock
import { prismaMock } from '../prismaMock';

describe('POST /api/v1/authentication/active-account/', () => {
  describe('status 200', () => {
    it('Activate account with valid OTP', async () => {
      const OTP = '123456';
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.userOTP.findFirst.mockResolvedValue({
        id: 1,
        otp: generateHash(OTP).hash,
        createdAt: new Date('22-04-19 12:00:17'),
        userId: 1,
      });

      const response = await request(app)
        .post('/api/v1/authentication/activate-account/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ otp: OTP });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({});
    });
  });

  describe('status 400', () => {
    it('Activate account with invalid OTP format', async () => {
      const OTP = 'abcdef';
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/authentication/activate-account/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ otp: OTP });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Invalid value',
            param: 'otp',
            value: OTP,
          },
        ],
      });
    });

    it('Activate account with wrong OTP', async () => {
      const OTP = '123456';
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.userOTP.findFirst.mockResolvedValue({
        id: 1,
        otp: generateHash(`Wrong-${OTP}`).hash,
        createdAt: new Date('22-04-19 12:00:17'),
        userId: 1,
      });

      const response = await request(app)
        .post('/api/v1/authentication/activate-account/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ otp: OTP });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            param: 'common',
            msg: 'Invalid code please try agains.',
          },
        ],
      });
    });
  });

  describe('status 401', () => {
    it('Activate account with invalid token', async () => {
      const OTP = '123456';

      await prismaMock.user.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/authentication/activate-account/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: 1 }
          )
        )
        .send({ otp: OTP });

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({});
    });
  });
});
