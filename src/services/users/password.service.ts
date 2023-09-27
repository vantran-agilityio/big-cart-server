// Libraries
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

// Utils
import { generateHash } from 'src/utils/generateHash.util';

interface IUpdateUserPasswordParameter {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

interface IUpdateUserPasswordReturn {
  code: number;
  data: {};
}

interface IUpdateUserPasswordError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const updateUserPassword = async (
  params: IUpdateUserPasswordParameter
): Promise<IUpdateUserPasswordReturn> => {
  const user = await prisma.user.findFirst({
    where: { id: params.userId },
  });

  if (!!user && !bcrypt.compareSync(params.currentPassword, user.password)) {
    const errors: IUpdateUserPasswordError[] = [
      {
        value: params.currentPassword,
        msg: 'Current password is incorrect',
        param: 'currentPassword',
        location: 'body',
      },
    ];

    return {
      code: StatusCodes.BAD_REQUEST,
      data: { errors },
    };
  } else {
    const { hash: hashedPassword } = generateHash(params.newPassword);

    await prisma.user.update({
      where: { id: params.userId },
      data: { password: hashedPassword },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  }
};

export const passwordService = {
  updateUserPassword,
};
