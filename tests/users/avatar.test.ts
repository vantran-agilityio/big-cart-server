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

describe('PATCH /api/v1/users/:userId/avatar', () => {
  describe('status 200', () => {
    it('Update user avatar', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };
      const userImage = {
        id: 1,
        url: '',
        userId: 1,
        categoryId: null,
        productId: null,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.image.update.mockResolvedValue(userImage);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/avatar/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .attach('image', '');

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ image: userImage.url });
    });
  });

  describe('status 400', () => {
    it('Update user avatar with invalid user id', async () => {
      const wrongUserId = 2;
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };
      const userImage = {
        id: 1,
        url: '',
        userId: 1,
        categoryId: null,
        productId: null,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.image.update.mockResolvedValue(userImage);

      const response = await request(app)
        .patch(`/api/v1/users/${wrongUserId}/avatar/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .attach('image', '');

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'params',
            msg: 'You do not have sufficient permission to access this endpoint',
            param: 'userId',
            value: `${wrongUserId}`,
          },
        ],
      });
    });
  });
});
