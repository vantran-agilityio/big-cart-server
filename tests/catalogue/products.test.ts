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

describe('GET /api/v1/catalogue/products', () => {
  describe('status 200', () => {
    it('Get all products by query', async () => {
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

      const products = [
        {
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
          images: [
            { url: 'https://via.placeholder.com/150' },
            { url: 'https://via.placeholder.com/150' },
          ],
        },
        {
          id: 2,
          name: 'pineapple #2',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
          price: 30,
          quantityStock: 16,
          createdAt: '2023-04-04T08:15:07.857Z',
          updatedAt: '2023-04-04T08:15:07.858Z',
          categoryId: 1,
          productUnitId: 1,
          images: [
            { url: 'https://via.placeholder.com/150' },
            { url: 'https://via.placeholder.com/150' },
          ],
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findMany.mockResolvedValue(products);

      const response = await request(app)
        .get(
          '/api/v1/catalogue/products?limit=10&page=1&categoryId=1&minPrice=10&maxPrice=30&sortBy=name&orderBy=asc'
        )
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.products).toEqual([
        {
          ...products[0],
          images: [products[0].images[0].url, products[0].images[1].url],
        },
        {
          ...products[1],
          images: [products[1].images[0].url, products[1].images[1].url],
        },
      ]);
    });

    it('Get all products without query', async () => {
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

      const products = [
        {
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
          images: [
            { url: 'https://via.placeholder.com/150' },
            { url: 'https://via.placeholder.com/150' },
          ],
        },
        {
          id: 2,
          name: 'pineapple #2',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
          price: 30,
          quantityStock: 16,
          createdAt: '2023-04-04T08:15:07.857Z',
          updatedAt: '2023-04-04T08:15:07.858Z',
          categoryId: 1,
          productUnitId: 1,
          images: [
            { url: 'https://via.placeholder.com/150' },
            { url: 'https://via.placeholder.com/150' },
          ],
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findMany.mockResolvedValue(products);

      const response = await request(app)
        .get('/api/v1/catalogue/products')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.products).toEqual([
        {
          ...products[0],
          images: [products[0].images[0].url, products[0].images[1].url],
        },
        {
          ...products[1],
          images: [products[1].images[0].url, products[1].images[1].url],
        },
      ]);
    });
  });
});

describe('POST /api/v1/catalogue/products', () => {
  describe('status 200', () => {
    it('creates a new products with valid data', async () => {
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

      const product = {
        categoryId: 1,
        productUnitId: 1,
        name: 'pineapple #1',
        price: 30,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        quantityStock: 16,
      };

      const images = [
        {
          productId: 1,
          url: 'https://via.placeholder.com/150',
        },
        {
          productId: 1,
          url: 'https://via.placeholder.com/150',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(null);

      await prismaMock.productUnit.findFirst.mockResolvedValue({
        id: 1,
        name: 'each',
      });

      await prismaMock.category.findFirst.mockResolvedValue({
        id: 1,
        name: 'Demo Category',
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
      });

      await prismaMock.product.create.mockResolvedValue({
        id: 1,
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
        ...product,
      });

      await prismaMock.image.createMany.mockResolvedValue([
        {
          id: 1,
          ...images[0],
        },
        {
          id: 2,
          ...images[1],
        },
      ]);

      const response = await request(app)
        .post('/api/v1/catalogue/products/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(product);

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        ...product,
        id: 1,
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
        images: [images[0].url, images[1].url],
      });
    });
  });

  describe('status 400', () => {
    it('creates a new products with invalid categoryId or productUnitId', async () => {
      const product = {
        categoryId: 1,
        productUnitId: 1,
        name: 'pineapple #1',
        price: 30,
        image: 'https://via.placeholder.com/150',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        quantityStock: 16,
      };

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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(null);

      await prismaMock.productUnit.findFirst.mockResolvedValue(null);

      await prismaMock.category.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/catalogue/products/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(product);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Category does not exist',
          param: 'categoryId',
          value: product.categoryId,
        },
        {
          location: 'body',
          msg: 'Product Unit does not exist',
          param: 'productUnitId',
          value: product.productUnitId,
        },
      ]);
    });

    it('creates a new products with invalid name format', async () => {
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

      const product = {
        categoryId: 1,
        productUnitId: 1,
        name: 123,
        price: 30,
        image: 'https://via.placeholder.com/150',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        quantityStock: 16,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/v1/catalogue/products/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(product);

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'name',
          value: product.name,
        },
      ]);
    });
  });

  describe('status 409', () => {
    it('creates a new products with used name', async () => {
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

      const product = {
        categoryId: 1,
        productUnitId: 1,
        name: 'pineapple #1',
        price: 30,
        image: 'https://via.placeholder.com/150',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        quantityStock: 16,
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue({
        id: 1,
        ...product,
      });

      await prismaMock.productUnit.findFirst.mockResolvedValue({
        id: 1,
        name: 'each',
      });

      await prismaMock.category.findFirst.mockResolvedValue({
        id: 1,
        name: 'Demo Category',
        createdAt: '2023-03-27T17:20:37.832Z',
        updatedAt: '2023-03-27T17:20:37.832Z',
      });

      const response = await request(app)
        .post('/api/v1/catalogue/products/')
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send(product);

      expect(response.status).toEqual(StatusCodes.CONFLICT);
      expect(response.body.errors).toEqual([
        {
          location: 'body',
          msg: 'Name already registered',
          param: 'name',
          value: product.name,
        },
      ]);
    });
  });
});

describe('GET /api/v1/catalogue/products/:productId/', () => {
  describe('status 200', () => {
    it('Get product by productId', async () => {
      const productId = '1';

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
        images: [
          { url: 'https://via.placeholder.com/150' },
          { url: 'https://via.placeholder.com/150' },
        ],
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(product);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${productId}`)
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
        ...product,
        images: [product.images[0].url, product.images[1].url],
      });
    });
  });

  describe('status 400', () => {
    it('Get product by invalid productId', async () => {
      const productId = '3ss';

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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${productId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        errors: [
          {
            location: 'params',
            msg: 'Invalid value',
            param: 'productId',
            value: productId,
          },
        ],
      });
    });
  });

  describe('status 404', () => {
    it('Cannot find product', async () => {
      const email = 'iloveauth@example.com';
      const productId = '3';

      const user = {
        id: 1,
        email,
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${productId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({});
    });
  });
});

describe('GET /api/v1/catalogue/products/:productId/reviews', () => {
  describe('status 200', () => {
    it('Get all reviews of product', async () => {
      const user = {
        id: 1,
        email: 'iloveauth@example.com',
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
        image: {
          url: 'https://via.placeholder.com/150',
        },
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
        image: [
          { url: 'https://via.placeholder.com/150' },
          { url: 'https://via.placeholder.com/150' },
        ],
      };

      const reviews = [
        {
          id: 1,
          userName: "Vinmart's User",
          userImage: 'https://via.placeholder.com/150',
          rating: 4.5,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
        {
          id: 2,
          userName: "Vinmart's User",
          userImage: 'https://via.placeholder.com/150',
          rating: 4,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(product);

      await prismaMock.review.findMany.mockResolvedValue(reviews);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${product.id}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body.reviews).toEqual([
        {
          ...reviews[0],
        },
        {
          ...reviews[1],
        },
      ]);
    });
  });

  describe('status 400', () => {
    it('Get product by invalid productId', async () => {
      const productId = '1ss';

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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${productId}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe('status 404', () => {
    it('Cannot find product', async () => {
      const productId = '1';
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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/v1/catalogue/products/${productId}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});

describe('POST /api/v1/catalogue/products/:productId/reviews', () => {
  describe('status 200', () => {
    it('Add new review to product', async () => {
      const email = 'iloveauth@example.com';
      const productId = '1';

      const user = {
        id: 1,
        email,
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
        image: {
          url: 'https://via.placeholder.com/150',
        },
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
        image: [
          { url: 'https://via.placeholder.com/150' },
          { url: 'https://via.placeholder.com/150' },
        ],
      };

      const review = {
        id: 1,
        userName: user.name,
        userImage: 'https://via.placeholder.com/150',
        rating: 4.5,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(product);

      await prismaMock.review.create.mockResolvedValue(review);

      const response = await request(app)
        .post(`/api/v1/catalogue/products/${productId}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          rating: review.rating,
          description: review.description,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(review);
    });
  });

  describe('status 400', () => {
    it('Get product by invalid productId', async () => {
      const productId = '1ss';

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

      await prismaMock.user.findFirst.mockResolvedValue(user);

      const response = await request(app)
        .post(`/api/v1/catalogue/products/${productId}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    });
  });

  describe('status 404', () => {
    it('Add new review to product', async () => {
      const email = 'iloveauth@example.com';
      const productId = '1';

      const user = {
        id: 1,
        email,
        password:
          '$2b$10$LWKeMbBXbGt4igl7fff8B.AuiYm4tU.IIAJoCCS9lLvvA6Ymqjv26',
        status: UserStatus.ACTIVE,
        name: "Vinmart's User",
        createdAt: new Date('22-04-19 12:00:17'),
        updatedAt: new Date('22-04-19 14:20:00'),
        image: {
          url: 'https://via.placeholder.com/150',
        },
      };

      const review = {
        id: 1,
        userName: "Vinmart's User",
        userImage: 'https://via.placeholder.com/150',
        rating: 4.5,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus neque nisl.',
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      await prismaMock.user.findFirst.mockResolvedValue(user);

      await prismaMock.product.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/v1/catalogue/products/${productId}/reviews`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          rating: review.rating,
          description: review.description,
        });

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
