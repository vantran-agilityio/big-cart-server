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

describe('GET /api/v1/catalogue/categories', () => {
  describe('status 200', () => {
    it('Get all categories', async () => {
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

      const categories = [
        {
          id: 1,
          name: 'Demo Category #1',
          createdAt: '2023-03-27T17:20:37.832Z',
          updatedAt: '2023-03-27T17:20:37.832Z',
          image: { url: 'https://via.placeholder.com/150' },
        },
        {
          id: 2,
          name: 'Demo Category #2',
          createdAt: '2023-03-28T06:01:02.232Z',
          updatedAt: '2023-03-28T06:01:02.233Z',
          image: { url: 'https://via.placeholder.com/150' },
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.category.findMany.mockResolvedValue(categories);

      const response = await request(app)
        .get('/api/v1/catalogue/categories/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.categories).toEqual([
        {
          id: categories[0]['id'],
          name: categories[0]['name'],
          createdAt: categories[0]['createdAt'],
          updatedAt: categories[0]['updatedAt'],
          image: categories[0]['image']['url'],
        },
        {
          id: categories[1]['id'],
          name: categories[1]['name'],
          createdAt: categories[1]['createdAt'],
          updatedAt: categories[1]['updatedAt'],
          image: categories[1]['image']['url'],
        },
      ]);
    });
  });
});

describe('POST /api/v1/catalogue/categories', () => {
  describe('status 200', () => {
    it('creates a new category with valid name', async () => {
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

      const category = {
        name: 'Demo Category',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.category.findFirst.mockResolvedValue(null);

      const newCategory = await prismaMock.category.create.mockResolvedValue({
        id: 1,
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
        ...category,
      });

      await prismaMock.image.create.mockResolvedValue([
        {
          id: 1,
          categoryId: newCategory.id,
          url: 'https://via.placeholder.com/150',
        },
      ]);

      const response = await request(app)
        .post('/api/v1/catalogue/categories/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(category);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        id: 1,
        name: category.name,
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
      });
    });
  });

  describe('status 400', () => {
    it('creates a new category with invalid name', async () => {
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

      const category = {
        name: 123,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/catalogue/categories/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(category);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'name',
          value: category.name,
        },
      ]);
    });
  });

  describe('status 409', () => {
    it('creates a new category with used name', async () => {
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

      const category = {
        name: 'Demo Category',
        image: 'https://via.placeholder.com/150',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.category.findFirst.mockResolvedValue({
        id: 1,
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
        ...category,
      });

      const response = await request(app)
        .post('/api/v1/catalogue/categories/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(category);

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Name already registered',
          param: 'name',
          value: category.name,
        },
      ]);
    });
  });
});
