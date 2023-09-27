import { param } from 'express-validator';
// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';
import { UserStatus } from '@prisma/client';

// Utils
import { generateHash } from 'src/utils/generateHash.util';
import { generateJWT } from 'src/utils/generateJWT.util';
import { generateOTP } from 'src/utils/generateOTP.util';

// Helpers
import { sendVerificationOTP } from 'src/helpers/authentication';

interface ISignUpParameter {
  email: string;
  password: string;
  phone: string;
}

interface ICreateServiceReturn {
  code: number;
  data: {
    errors?: IError[];
    token?: string;
  };
}

interface IError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export const signUp = async (
  params: ISignUpParameter
): Promise<ICreateServiceReturn> => {
  const user = await prisma.user.findFirst({
    where: { email: params.email },
  });

  const phone = await prisma.phone.findFirst({
    where: { phone: params.phone },
  });

  if (!!user || !!phone) {
    // Check user and phone are registered yet
    const errors: IError[] = [];

    if (!!user) {
      errors.push({
        value: params.email,
        msg: 'Email already registered',
        param: 'email',
        location: 'body',
      });
    }

    if (!!phone) {
      errors.push({
        value: params.phone,
        msg: 'Phone Number already registered',
        param: 'phone',
        location: 'body',
      });
    }

    return {
      code: StatusCodes.CONFLICT,
      data: { errors },
    };
  } else {
    const mockImage = 'https://via.placeholder.com/150';

    // Create new user from received args
    const OTP: string = generateOTP();
    const { hash: hashedOTP } = generateHash(OTP);
    const { hash: hashedPassword } = generateHash(params.password);

    const newUser = await prisma.user.create({
      data: {
        status: UserStatus.PRE_ACTIVE,
        name: "Vinmart's User",
        email: params.email,
        password: hashedPassword,
      },
    });

    await prisma.userSetting.create({
      data: {
        userId: newUser.id,
        enableEmailNotification: false,
        enableOrderNotification: false,
        enableGeneralNotification: true,
      },
    });

    await prisma.phone.create({
      data: {
        userId: newUser.id,
        phone: params.phone,
      },
    });

    await prisma.image.create({
      data: {
        userId: newUser.id,
        url: mockImage,
      },
    });

    await prisma.userOTP.upsert({
      where: { userId: newUser.id },
      update: { otp: hashedOTP },
      create: { userId: newUser.id, otp: hashedOTP },
    });

    await sendVerificationOTP(newUser.email, OTP);

    return {
      code: StatusCodes.CREATED,
      data: {
        token: generateJWT(
          { secretOrKey: process.env.JWT_AUTHENTICATE_OTP_SECRET as string },
          { userId: newUser.id }
        ),
      },
    };
  }
};

export const signUpService = {
  signUp,
};
