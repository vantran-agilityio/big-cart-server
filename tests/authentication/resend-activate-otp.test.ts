// Libraries
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';

// Prisma
import { UserStatus } from '@prisma/client';

// Server
import { app } from '../../src/server';

// Utils
import { generateJWT } from '../../src/utils';

// Mock
import { prismaMock } from '../prismaMock';

describe('POST /api/v1/authentication/resend-activate-otp', () => {
  describe('status 200', () => {
    it('Resend OTP with valid email', async () => {
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
        .post('/api/v1/authentication/resend-activate-otp/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({});
    });
  });

  describe('status 401', () => {
    it('Resend OTP with wrong email', async () => {
      await prismaMock.user.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/authentication/resend-activate-otp/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
            { userId: 1 }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({});
    });
  });
});
