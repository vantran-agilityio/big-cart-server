// Libraries
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';
import { UserStatus } from '@prisma/client';

interface ICreateServiceParameter {
  otp: string;
  userId: number;
}

interface ICreateServiceReturn {
  code: number;
  data: { errors?: IError[] };
}

interface IError {
  param: string;
  msg: string;
}

const activateAccount = async (
  params: ICreateServiceParameter
): Promise<ICreateServiceReturn> => {
  const userOTP = await prisma.userOTP.findFirst({
    where: { userId: params.userId },
  });

  if (!userOTP || (!!userOTP && !bcrypt.compareSync(params.otp, userOTP.otp))) {
    return {
      code: StatusCodes.BAD_REQUEST,
      data: {
        errors: [
          {
            param: 'common',
            msg: 'Invalid code please try agains.',
          },
        ],
      },
    };
  } else {
    await prisma.user.update({
      where: { id: params.userId },
      data: { status: UserStatus.ACTIVE },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  }
};

export const activateAccountService = {
  activateAccount,
};
