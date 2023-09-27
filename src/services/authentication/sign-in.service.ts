// Libraries
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';
import { UserStatus } from '@prisma/client';

// Utils
import { generateJWT } from 'src/utils/generateJWT.util';

interface ISignInParameter {
  email: string;
  password: string;
}

interface ISignInReturn {
  code: number;
  data: {
    token?: string;
    errors?: IError[];
  };
}

interface IError {
  param: string;
  msg: string;
}

const signIn = async (params: ISignInParameter): Promise<ISignInReturn> => {
  const user = await prisma.user.findFirst({
    where: { email: params.email },
  });

  if (
    !user ||
    (!!user && !bcrypt.compareSync(params.password, user.password))
  ) {
    return {
      code: StatusCodes.BAD_REQUEST,
      data: {
        errors: [
          {
            param: 'common',
            msg: 'Something went wrong during the authentication process. Please try signing in again.',
          },
        ],
      },
    };
  } else if (!!user && user.status !== UserStatus.ACTIVE) {
    return {
      code: StatusCodes.BAD_REQUEST,
      data: {
        errors: [
          {
            param: 'common',
            msg: 'This Vinmart account is not active.',
          },
        ],
      },
    };
  } else {
    return {
      code: StatusCodes.OK,
      data: {
        token: generateJWT(
          { secretOrKey: process.env.JWT_AUTHENTICATE_SECRET as string },
          { userId: user.id }
        ),
      },
    };
  }
};

export const signInService = {
  signIn,
};
