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

describe('PATCH /api/v1/users/:userId/notification-settings', () => {
  describe('status 200', () => {
    it('Update user notification settings', async () => {
      const enableEmailNotification = true;
      const enableOrderNotification = false;
      const enableGeneralNotification = true;

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

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.userSetting.update.mockResolvedValueOnce({
        id: 1,
        userId: user.id,
        enableEmailNotification,
        enableOrderNotification,
        enableGeneralNotification,
      });

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/notification-settings/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          enableEmailNotification,
          enableOrderNotification,
          enableGeneralNotification,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        enableEmailNotification,
        enableOrderNotification,
        enableGeneralNotification,
      });
    });
  });

  describe('status 400', () => {
    it('Update user password with invalid user id', async () => {
      const enableEmailNotification = true;
      const enableOrderNotification = false;
      const enableGeneralNotification = true;

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

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.userSetting.update.mockResolvedValueOnce({
        id: 1,
        userId: user.id,
        enableEmailNotification,
        enableOrderNotification,
        enableGeneralNotification,
      });

      const response = await request(app)
        .patch(`/api/v1/users/${wrongUserId}/notification-settings/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          enableEmailNotification,
          enableOrderNotification,
          enableGeneralNotification,
        });

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
