// Libraries
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Model
import { User } from '@prisma/client';

// Service
import { addressesService } from 'src/services/users';

const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await addressesService.getUserAddresses({
      userId: (req.user as User).id,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

const addUserAddress = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await addressesService.addUserAddress({
      userId: (req.user as User).id,
      recipientName: req.body.recipientName,
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
      phone: req.body.phone,
      default: req.body.default,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

const updateUserAddress = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await addressesService.updateUserAddress({
      userId: (req.user as User).id,
      addressId: req.params.addressId,
      recipientName: req.body.recipientName,
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
      phone: req.body.phone,
      default: req.body.default,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

const deleteUserAddress = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await addressesService.deleteUserAddress({
      userId: (req.user as User).id,
      addressId: req.params.addressId,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

export const addressesController = {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
