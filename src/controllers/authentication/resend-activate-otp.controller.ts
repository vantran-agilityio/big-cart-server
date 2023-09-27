// Libraries
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Model
import { User } from '@prisma/client';

// Service
import { resendActivateOTPService } from 'src/services/authentication';

const resendActivateOTP = async (req: Request, res: Response) => {
  try {
    const result = await resendActivateOTPService.resendActivateOTP({
      id: (req.user as User).id,
      email: (req.user as User).email,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

export const resendActivateOTPController = {
  resendActivateOTP,
};
