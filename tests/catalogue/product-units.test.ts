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

describe('GET /api/v1/catalogue/product-units', () => {
  describe('status 200', () => {
    it('Get all product units', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      const productUnits = [
        {
          id: 1,
          name: 'Demo Product Unit #1',
        },
        {
          id: 2,
          name: 'Demo Product Unit #2',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.productUnit.findMany.mockResolvedValue(productUnits);

      const response = await request(app)
        .get('/api/v1/catalogue/product-units/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.productUnits).toEqual([
        {
          id: productUnits[0].id,
          name: productUnits[0].name,
        },
        {
          id: productUnits[1].id,
          name: productUnits[1].name,
        },
      ]);
    });
  });
});

describe('POST /api/v1/catalogue/product-units', () => {
  describe('status 200', () => {
    it('creates a new product unit with valid name', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      const productUnit = {
        name: 'Demo Product Unit',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.productUnit.findFirst.mockResolvedValue(null);

      await prismaMock.productUnit.create.mockResolvedValue({
        id: 1,
        ...productUnit,
      });

      const response = await request(app)
        .post('/api/v1/catalogue/product-units/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(productUnit);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: 1,
        name: productUnit.name,
      });
    });
  });

  describe('status 400', () => {
    it('creates a new product unit with invalid name', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      const productUnit = {
        name: 123,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/catalogue/product-units/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(productUnit);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'name',
          value: productUnit.name,
        },
      ]);
    });
  });

  describe('status 409', () => {
    it('creates a new product unit with used name', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      const productUnit = {
        name: 'Demo Product Unit',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.productUnit.findFirst.mockResolvedValue({
        id: 1,
        ...productUnit,
      });

      const response = await request(app)
        .post('/api/v1/catalogue/product-units/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(productUnit);

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Name already registered',
          param: 'name',
          value: productUnit.name,
        },
      ]);
    });
  });
});
