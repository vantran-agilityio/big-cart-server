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

describe('GET /:userId/favorite-items', () => {
  describe('status 200', () => {
    it('Get user favorite items', async () => {
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

      const favoriteItems = [
        {
          id: 1,
          productId: 4,
        },
        {
          id: 2,
          productId: 7,
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.favoriteItem.findMany.mockResolvedValue(favoriteItems);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/favorite-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ favoriteItems });
    });
  });

  describe('status 400', () => {
    it('Get user favorite items with invalid user id', async () => {
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

      const favoriteItems = [
        {
          id: 1,
          productId: 4,
        },
        {
          id: 2,
          productId: 7,
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.favoriteItem.findMany.mockResolvedValue(favoriteItems);

      const response = await request(app)
        .get(`/api/v1/users/${wrongUserId}/favorite-items/`)
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

describe('POST /:userId/favorite-items', () => {
  describe('status 200', () => {
    it('Add user favorite item', async () => {
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

      const product = {
        id: 1,
        name: 'pineapple #1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        price: 30,
        quantityStock: 16,
        createdAt: '2023-04-04T08:15:07.857Z',
        updatedAt: '2023-04-04T08:15:07.858Z',
        categoryId: 1,
        productUnitId: 1,
        image: [undefined, undefined],
      };

      const favoriteItem = {
        id: 1,
        productId: product.id,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.product.findFirst.mockResolvedValueOnce(product);
      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(undefined);

      await prismaMock.favoriteItem.create.mockResolvedValueOnce(favoriteItem);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/favorite-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          productId: product.id,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(favoriteItem);
    });
  });

  describe('status 400', () => {
    it('Add user favorite items with invalid user id', async () => {
      const wrongUserId = 2;
      const productId = 4;
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

      const favoriteItem = {
        id: 1,
        productId,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(undefined);
      await prismaMock.favoriteItem.create.mockResolvedValueOnce(favoriteItem);

      const response = await request(app)
        .post(`/api/v1/users/${wrongUserId}/favorite-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          productId,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });
  });

  describe('status 404', () => {
    it('Create a new favorite item with wrong product id', async () => {
      const wrongProductId = 2;
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

      const favoriteItem = {
        id: 1,
        productId: wrongProductId,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(undefined);

      await prismaMock.favoriteItem.create.mockResolvedValueOnce(favoriteItem);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/favorite-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          productId: wrongProductId,
        });

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Product does not exist',
            param: 'productId',
            value: wrongProductId,
          },
        ],
      });
    });
  });

  describe('status 409', () => {
    it('Create a new favorite item with used product id', async () => {
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

      const foundProduct = {
        id: 1,
        name: 'pineapple #1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        price: 30,
        quantityStock: 16,
        createdAt: '2023-04-04T08:15:07.857Z',
        updatedAt: '2023-04-04T08:15:07.858Z',
        categoryId: 1,
        productUnitId: 1,
        image: [undefined, undefined],
      };

      const foundFavoriteItem = {
        id: 1,
        productId: foundProduct.id,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.product.findFirst.mockResolvedValueOnce(foundProduct);
      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(
        foundFavoriteItem
      );

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/favorite-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ productId: foundProduct.id });

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Product already selected',
            param: 'productId',
            value: foundProduct.id,
          },
        ],
      });
    });
  });
});

describe('DELETE /:userId/favorite-items/:favoriteItemId', () => {
  describe('status 200', () => {
    it('Delete user favorite item', async () => {
      const favoriteItemId = '1';
      const productId = 4;
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
      const foundFavoriteItem = {
        id: 1,
        productId,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(
        foundFavoriteItem
      );
      await prismaMock.favoriteItem.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}/favorite-items/${favoriteItemId}`)
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
    it('Delete user favorite items with invalid user id', async () => {
      const wrongUserId = 2;
      const favoriteItemId = '1';
      const productId = 4;
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
      const foundFavoriteItem = {
        id: 1,
        productId,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.favoriteItem.findFirst.mockResolvedValueOnce(
        foundFavoriteItem
      );
      await prismaMock.favoriteItem.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${wrongUserId}/favorite-items/${favoriteItemId}`)
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
    it('Delete user favorite items with invalid favorite item id', async () => {
      const favoriteItemId = '1';
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
        .delete(`/api/v1/users/${user.id}/favorite-items/${favoriteItemId}`)
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
            value: favoriteItemId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'favoriteItemId',
            location: 'params',
          },
        ],
      });
    });
  });
});
