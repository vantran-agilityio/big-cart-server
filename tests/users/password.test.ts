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

describe('PATCH /api/v1/users/:userId/password', () => {
  describe('status 200', () => {
    it('Update user password', async () => {
      const currentPassword = 'Example123!@#';
      const newPassword = 'Example456$%^';
      const confirmPassword = 'Example456$%^';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password: generateHash(currentPassword).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/password/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          currentPassword,
          newPassword,
          confirmPassword,
        });

      expect(response.status).toEqual(StatusCodes.OK);
    });
  });

  describe('status 400', () => {
    it('Update user password with invalid user id', async () => {
      const currentPassword = 'Example123!@#';
      const newPassword = 'Example456$%^';
      const confirmPassword = 'Example456$%^';

      const wrongUserId = 2;

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password: generateHash(currentPassword).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .patch(`/api/v1/users/${wrongUserId}/password/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          currentPassword,
          newPassword,
          confirmPassword,
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

    it('Current password is incorrect', async () => {
      const wrongCurrentPassword = 'Wrong123!@#';
      const currentPassword = 'Example123!@#';
      const newPassword = 'Example456$%^';
      const confirmPassword = 'Example456$%^';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password: generateHash(currentPassword).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/password/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          currentPassword: wrongCurrentPassword,
          newPassword,
          confirmPassword,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            value: wrongCurrentPassword,
            msg: 'Current password is incorrect',
            param: 'currentPassword',
            location: 'body',
          },
        ],
      });
    });

    it('New password is matched with current password', async () => {
      const currentPassword = 'Example123!@#';
      const newPassword = 'Example123!@#';
      const confirmPassword = 'Example123!@#';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password: generateHash(currentPassword).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/password/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          currentPassword,
          newPassword,
          confirmPassword,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            value: newPassword,
            msg: 'New password cannot be same as current password',
            param: 'newPassword',
            location: 'body',
          },
        ],
      });
    });

    it('New password is matched with confirm password', async () => {
      const currentPassword = 'Example123!@#';
      const newPassword = 'Example456$%^';
      const confirmPassword = 'Example789$%^';

      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        phone: { phone: '+84919473533' },
        image: { url: 'https://via.placeholder.com/150' },
        password: generateHash(currentPassword).hash,
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/password/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          currentPassword,
          newPassword,
          confirmPassword,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            value: confirmPassword,
            msg: 'Confirm password should be same as new password',
            param: 'confirmPassword',
            location: 'body',
          },
        ],
      });
    });
  });
});
