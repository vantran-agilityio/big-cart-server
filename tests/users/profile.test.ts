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

describe('GET /api/v1/users/:userId/profile', () => {
  describe('status 200', () => {
    it('Get user profile', async () => {
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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: 1,
        email: 'iloveauth@example.com',
        image: 'https://via.placeholder.com/150',
        name: "Vinmart's User",
        phone: '+84919473533',
      });
    });
  });

  describe('status 400', () => {
    it('Get user profile with invalid user id', async () => {
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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .get(`/api/v1/users/${wrongUserId}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });
  });
});

describe('PATCH /api/v1/users/:userId/profile', () => {
  describe('status 200', () => {
    it('Update user profile', async () => {
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

      const newUser = {
        id: 1,
        email: 'email@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: 'Mock User',
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      const newPhone = {
        id: 1,
        userId: 1,
        phone: '+84911111111',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(null);
      await prismaMock.phone.findFirst.mockResolvedValue(null);

      await prismaMock.user.update.mockResolvedValueOnce(newUser);

      await prismaMock.phone.update.mockResolvedValueOnce(newPhone);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          email: newUser.email,
          phone: newPhone.phone,
          name: newUser.name,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: 1,
        email: newUser.email,
        phone: newPhone.phone,
        name: newUser.name,
      });
    });

    it('Update user profile by current user value', async () => {
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

      const phone = {
        id: 1,
        userId: 1,
        phone: '+84911111111',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.phone.findFirst.mockResolvedValue(phone);

      await prismaMock.user.update.mockResolvedValueOnce(user);
      await prismaMock.phone.update.mockResolvedValue(phone);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          email: user.email,
          phone: phone.phone,
          name: user.name,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: 1,
        email: user.email,
        phone: phone.phone,
        name: user.name,
      });
    });
  });

  describe('status 400', () => {
    it('Update user profile with invalid user id', async () => {
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

      const response = await request(app)
        .patch('/api/v1/users/2/profile/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          email: 'email@example.com',
          phone: '+84911111111',
          name: 'Mock User',
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });
  });

  describe('status 409', () => {
    it('Update user profile with existed email', async () => {
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

      const newUser = {
        id: 2,
        email: 'email@example.com',
        phone: { phone: '+84911111111' },
        image: { url: 'https://via.placeholder.com/150' },
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: 'Mock User',
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(newUser);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          email: newUser.email,
          phone: newUser.phone.phone,
          name: newUser.name,
        });

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).toEqual({
        errors: [
          {
            value: newUser.email,
            msg: 'Email already registered',
            param: 'email',
            location: 'body',
          },
        ],
      });
    });

    it('Update user profile with existed phone', async () => {
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

      const newPhone = '+84911111111';

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.user.findFirst.mockResolvedValueOnce(null);
      await prismaMock.phone.findFirst.mockResolvedValue({
        id: 2,
        userId: 2,
        phone: newPhone,
      });

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/profile/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          email: 'email@example.com',
          phone: newPhone,
          name: 'Mock User',
        });

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).toEqual({
        errors: [
          {
            value: newPhone,
            msg: 'Phone Number already registered',
            param: 'phone',
            location: 'body',
          },
        ],
      });
    });
  });
});
