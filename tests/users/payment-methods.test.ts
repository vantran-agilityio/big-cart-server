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

describe('GET /:userId/payment-methods', () => {
  describe('status 200', () => {
    it('Get user payment methods', async () => {
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

      const paymentMethods = [
        {
          id: 1,
          type: 'PAYPAL',
        },
        {
          id: 2,
          type: 'APPLE_PAY',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.paymentMethod.findMany.mockResolvedValue(paymentMethods);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/payment-methods/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ paymentMethods });
    });
  });

  describe('status 400', () => {
    it('Get user payment methods with invalid user id', async () => {
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

      const paymentMethods = [
        {
          id: 1,
          paymentType: 'PAYPAL',
        },
        {
          id: 2,
          paymentType: 'APPLE_PAY',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.paymentMethod.findMany.mockResolvedValue(paymentMethods);

      const response = await request(app)
        .get(`/api/v1/users/${wrongUserId}/payment-methods/`)
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

describe('POST /:userId/payment-methods', () => {
  describe('status 200', () => {
    it('Add user payment method', async () => {
      const paymentType = 'PAYPAL';
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

      const paymentMethod = {
        id: 1,
        type: paymentType,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.paymentMethod.create.mockResolvedValueOnce(
        paymentMethod
      );

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/payment-methods/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          paymentType,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(paymentMethod);
    });
  });

  describe('status 400', () => {
    it('Add user payment methods with invalid user id', async () => {
      const wrongUserId = 2;
      const paymentType = 'PAYPAL';
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

      const paymentMethod = {
        id: 1,
        type: paymentType,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.paymentMethod.create.mockResolvedValueOnce(
        paymentMethod
      );

      const response = await request(app)
        .post(`/api/v1/users/${wrongUserId}/payment-methods/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          paymentType,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });

    it('Add user payment methods with invalid payment type', async () => {
      const paymentType = 'ABC';
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
        .post(`/api/v1/users/${user.id}/payment-methods/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          paymentType,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'This payment type is does not exist',
            param: 'paymentType',
            value: paymentType,
          },
        ],
      });
    });
  });
});

describe('DELETE /:userId/payment-methods/:paymentMethodId', () => {
  describe('status 200', () => {
    it('Delete user payment method', async () => {
      const paymentMethodId = '1';
      const paymentType = 'PAYPAL';
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
      const foundPaymentMethod = {
        id: 1,
        paymentType,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.paymentMethod.findFirst.mockResolvedValueOnce(
        foundPaymentMethod
      );
      await prismaMock.paymentMethod.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}/payment-methods/${paymentMethodId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
    });
  });

  describe('status 400', () => {
    it('Delete user payment methods with invalid user id', async () => {
      const wrongUserId = 2;
      const paymentMethodId = '1';
      const paymentType = 'PAYPAL';
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
      const foundPaymentMethod = {
        id: 1,
        paymentType,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.paymentMethod.findFirst.mockResolvedValueOnce(
        foundPaymentMethod
      );
      await prismaMock.paymentMethod.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(
          `/api/v1/users/${wrongUserId}/payment-methods/${paymentMethodId}`
        )
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

  describe('status 404', () => {
    it('Delete user payment methods with invalid payment method id', async () => {
      const paymentMethodId = '1';
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
        .delete(`/api/v1/users/${user.id}/payment-methods/${paymentMethodId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        errors: [
          {
            value: paymentMethodId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'paymentMethodId',
            location: 'params',
          },
        ],
      });
    });
  });
});
