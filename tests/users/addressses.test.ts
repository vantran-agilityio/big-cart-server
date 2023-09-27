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

describe('GET /:userId/addresses', () => {
  describe('status 200', () => {
    it('Get user addresses', async () => {
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

      const addresses = [
        {
          id: 1,
          recipientName: 'Russell Austin',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: { phone: '+84918364535' },
          default: true,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
        {
          id: 2,
          recipientName: 'Jissca Simpson',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: { phone: '+84918364536' },
          default: false,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
      ];

      const parsedAddresses = [
        {
          id: 1,
          recipientName: 'Russell Austin',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: '+84918364535',
          default: true,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
        {
          id: 2,
          recipientName: 'Jissca Simpson',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: '+84918364536',
          default: false,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.address.findMany.mockResolvedValue(addresses);

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/addresses/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send();

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ addresses: parsedAddresses });
    });
  });

  describe('status 400', () => {
    it('Get user addresses with invalid user id', async () => {
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

      const addresses = [
        {
          id: 1,
          recipientName: 'Russell Austin',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: { phone: '+84918364535' },
          default: true,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
        {
          id: 2,
          recipientName: 'Jissca Simpson',
          address: '2811 Crescent Day. LA Port',
          city: 'California',
          zipCode: 77571,
          country: 'United States',
          phone: { phone: '+84918364536' },
          default: false,
          createdAt: '22-04-19 12:00:17',
          updatedAt: '22-04-19 14:20:00',
        },
      ];

      await prismaMock.user.findFirst.mockResolvedValue(user);
      await prismaMock.address.findMany.mockResolvedValue(addresses);
      const response = await request(app)
        .get(`/api/v1/users/${wrongUserId}/addresses/`)
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

describe('POST /:userId/addresses', () => {
  describe('status 200', () => {
    it('Add user address', async () => {
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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      const parsedAddresses = {
        id: 3,
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      const phone = {
        addressId: parsedAddresses.id,
        phone: '+84919473535',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.address.create.mockResolvedValueOnce(parsedAddresses);
      await prismaMock.phone.create.mockResolvedValueOnce(phone);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/addresses/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ ...parsedAddresses });
    });
  });

  describe('status 400', () => {
    it('Add user address with invalid user id', async () => {
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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.address.findFirst.mockResolvedValueOnce(undefined);
      await prismaMock.address.create.mockResolvedValueOnce(address);

      const response = await request(app)
        .post(`/api/v1/users/${wrongUserId}/addresses/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });
  });

  describe('status 500', () => {
    it('Server crashed when add user addresses', async () => {
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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .post(`/api/v1/users/${user.id}/addresses/`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty('msg');
    });
  });
});

describe('UPDATE /:userId/addresses/:addressId', () => {
  describe('status 200', () => {
    it('Update user address', async () => {
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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      const parsedAddress = {
        id: 3,
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      const phone = {
        addressId: parsedAddress.id,
        phone: '+84919473535',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.address.findFirst.mockResolvedValueOnce(address);

      await prismaMock.address.update.mockResolvedValueOnce(parsedAddress);
      await prismaMock.phone.update.mockResolvedValueOnce(phone);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/addresses/${parsedAddress.id}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({ ...parsedAddress });
    });
  });

  describe('status 400', () => {
    it('Update user address with invalid user id', async () => {
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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      const parsedAddress = {
        id: 3,
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      const phone = {
        addressId: parsedAddress.id,
        phone: '+84919473535',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.address.findFirst.mockResolvedValueOnce(address);

      await prismaMock.address.update.mockResolvedValueOnce(parsedAddress);
      await prismaMock.phone.update.mockResolvedValueOnce(phone);

      const response = await request(app)
        .patch(`/api/v1/users/${wrongUserId}/addresses/${parsedAddress.id}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0].msg).toEqual(
        'You do not have sufficient permission to access this endpoint'
      );
    });
  });

  describe('status 404', () => {
    it('Update removed user address', async () => {
      const wrongAddressId = '2';

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

      const address = {
        recipientName: 'Crescent Do',
        address: '1601 Crescent Moon. DN Port',
        city: 'Da Nang',
        zipCode: 550000,
        country: 'Viet Nam',
        phone: '+84919473535',
        default: false,
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      const response = await request(app)
        .patch(`/api/v1/users/${user.id}/addresses/${wrongAddressId}`)
        .set(
          'Authorization',
          generateJWT(
            { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
            { userId: user.id }
          )
        )
        .send({
          ...address,
        });

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        errors: [
          {
            value: wrongAddressId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'addressId',
            location: 'params',
          },
        ],
      });
    });
  });
});

describe('DELETE /:userId/addresses/:addressId', () => {
  describe('status 200', () => {
    it('Delete user address', async () => {
      const addressId = '1';

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

      const foundAddress = {
        id: 1,
        recipientName: 'Russell Austin',
        address: '2811 Crescent Day. LA Port',
        city: 'California',
        zipCode: 77571,
        country: 'United States',
        phone: { phone: '+84918364535' },
        default: true,
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);

      await prismaMock.address.findFirst.mockResolvedValueOnce(foundAddress);
      await prismaMock.address.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}/addresses/${addressId}`)
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
    it('Delete user addresses with invalid user id', async () => {
      const wrongUserId = 2;
      const addressId = '1';

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

      const foundAddress = {
        id: 1,
        recipientName: 'Russell Austin',
        address: '2811 Crescent Day. LA Port',
        city: 'California',
        zipCode: 77571,
        country: 'United States',
        phone: { phone: '+84918364535' },
        default: true,
        createdAt: '22-04-19 12:00:17',
        updatedAt: '22-04-19 14:20:00',
      };

      await prismaMock.user.findFirst.mockResolvedValueOnce(user);
      await prismaMock.address.findFirst.mockResolvedValueOnce(foundAddress);
      await prismaMock.address.delete.mockResolvedValueOnce();

      const response = await request(app)
        .delete(`/api/v1/users/${wrongUserId}/addresses/${addressId}`)
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
    it('Delete user addresses with invalid address id', async () => {
      const addressId = '1';

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
        .delete(`/api/v1/users/${user.id}/addresses/${addressId}`)
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
            value: addressId,
            msg: 'Item does not exist. It may have been deleted',
            param: 'addressId',
            location: 'params',
          },
        ],
      });
    });
  });
});
