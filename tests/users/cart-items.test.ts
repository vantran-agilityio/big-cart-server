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

describe('GET /:userId/cart-items', () => {
  describe('status 200', () => {
    it('Get user cart items', async () => {
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

      const cartItems = [
        {
          id: 1,
          productId: 4,
          quantity: 10,
        },
        {
          id: 2,
          productId: 7,
          quantity: 5,
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.cartItem.findMany.mockResolvedValue(cartItems);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/cart-items/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ cartItems });
    });
  });

  describe('status 400', () => {
    it('Get user cart items with invalid user id', async () => {
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
        .get(`/api/v1/users/${wrongUserId}/cart-items/`)
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

describe('POST /:userId/cart-items', () => {
  describe('status 200', () => {
    it('Add user cart item', async () => {
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

      const cartItem = {
        id: 1,
        productId: 1,
        quantity: 1,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.product.findFirst.mockResolvedValueOnce(product);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(undefined);
      await prismaMock.cartItem.create.mockResolvedValueOnce(cartItem);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/cart-items/`)
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
      expect(response.body).toEqual(cartItem);
    });

    it('Get errors when product is out of stock', async () => {
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
        quantityStock: 0,
        createdAt: '2023-04-04T08:15:07.857Z',
        updatedAt: '2023-04-04T08:15:07.858Z',
        categoryId: 1,
        productUnitId: 1,
        image: [undefined, undefined],
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.product.findFirst.mockResolvedValueOnce(product);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/cart-items/`)
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
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Product is out of stock',
            param: 'productId',
            value: product.id,
          },
        ],
      });
    });
  });

  describe('status 400', () => {
    it('Add user cart items with invalid user id', async () => {
      const wrongUserId = 2;
      const productId = 1;

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

      const cartItem = {
        id: 1,
        productId,
        quantity: 1,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(undefined);
      await prismaMock.cartItem.create.mockResolvedValueOnce(cartItem);
      const response = await request(app)
        .post(`/api/v1/users/${wrongUserId}/cart-items/`)
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
    it('Create a new cart item with wrong product id', async () => {
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

      const cartItem = {
        id: 1,
        productId: wrongProductId,
        quantity: 1,
      };
      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(undefined);
      await prismaMock.cartItem.create.mockResolvedValueOnce(cartItem);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/cart-items/`)
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
    it('Create a new cart item with used product id', async () => {
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

      const foundCartItem = {
        id: 1,
        productId: foundProduct.id,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.product.findFirst.mockResolvedValueOnce(foundProduct);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(foundCartItem);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/cart-items/`)
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

describe('UPDATE /:userId/cart-items/:cartItemId', () => {
  describe('status 200', () => {
    it('Update user cart item', async () => {
      const cartItemId = '1';

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

      const foundCartItem = {
        id: 1,
        productId: 1,
        quantity: 1,
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

      const newCartItem = {
        id: 1,
        productId: 1,
        quantity: 15,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(foundCartItem);
      await prismaMock.product.findFirst.mockResolvedValueOnce(foundProduct);
      await prismaMock.cartItem.update.mockResolvedValueOnce(newCartItem);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/cart-items/${cartItemId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ quantity: newCartItem.quantity });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(newCartItem);
    });

    it('Get errors when product is out of stock', async () => {
      const cartItemId = '1';

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

      const foundCartItem = {
        id: 1,
        productId: 1,
        quantity: 1,
      };

      const newCartItem = {
        id: 1,
        productId: 1,
        quantity: 100,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(foundCartItem);
      await prismaMock.cartItem.update.mockResolvedValueOnce(newCartItem);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/cart-items/${cartItemId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ quantity: newCartItem.quantity });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'body',
            msg: 'Product is out of stock',
            param: 'quantity',
            value: newCartItem.quantity,
          },
        ],
      });
    });
  });

  describe('status 400', () => {
    it('Update user cart items with invalid user id', async () => {
      const wrongUserId = 2;
      const cartItemId = '1';

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
        .patch(`/api/v1/users/${wrongUserId}/cart-items/${cartItemId}`)
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
    it('Update user cart items with invalid cart item id', async () => {
      const cartItemId = '1';

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
        .patch(`/api/v1/users/${user.id}/cart-items/${cartItemId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({ quantity: 1 });

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        errors: [
          {
            value: cartItemId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'cartItemId',
            location: 'params',
          },
        ],
      });
    });
  });
});

describe('DELETE /:userId/cart-items/:cartItemId', () => {
  describe('status 200', () => {
    it('Delete user cart item', async () => {
      const cartItemId = '1';

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

      const foundCartItem = {
        id: 1,
        productId: 1,
        quantity: 1,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.cartItem.findFirst.mockResolvedValueOnce(foundCartItem);
      await prismaMock.cartItem.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}/cart-items/${cartItemId}`)
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
    it('Delete user cart items with invalid user id', async () => {
      const wrongUserId = 2;
      const cartItemId = '1';

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
        .delete(`/api/v1/users/${wrongUserId}/cart-items/${cartItemId}`)
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
    it('Delete user cart items with invalid cart item id', async () => {
      const cartItemId = '1';

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
        .delete(`/api/v1/users/${user.id}/cart-items/${cartItemId}`)
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
            value: cartItemId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'cartItemId',
            location: 'params',
          },
        ],
      });
    });
  });
});
