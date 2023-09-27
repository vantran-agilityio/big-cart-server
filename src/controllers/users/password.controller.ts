// Libraries
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Model
import { User } from '@prisma/client';

// Service
import { passwordService } from 'src/services/users';

const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await passwordService.updateUserPassword({
      userId: (req.user as User).id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

export const passwordController = { updateUserPassword };
