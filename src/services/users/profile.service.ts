// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IGetUserProfileParameter {
  userId: number;
}

interface IGetUserProfileReturn {
  code: number;
  data: {};
}

interface IUpdateUserProfileParameter {
  userId: number;
  email: string;
  phone: string;
  name: string;
}

interface IUpdateUserProfileReturn {
  code: number;
  data: {};
}

interface IUpdateUserProfileError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const getUserProfile = async (
  params: IGetUserProfileParameter
): Promise<IGetUserProfileReturn> => {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      phone: { select: { phone: true } },
      image: { select: { url: true } },
    },
    where: { id: params.userId },
  });

  return {
    code: StatusCodes.OK,
    data: {
      id: user!.id,
      name: user!.name,
      email: user!.email,
      phone: user!.phone!.phone,
      image: user!.image!.url,
    },
  };
};

const updateUserProfile = async (
  params: IUpdateUserProfileParameter
): Promise<IUpdateUserProfileReturn> => {
  const user = await prisma.user.findFirst({
    where: { email: params.email },
  });

  const phone = await prisma.phone.findFirst({
    where: { phone: params.phone },
  });

  if (
    (!!user && user.id !== params.userId) ||
    (!!phone && phone.userId !== params.userId)
  ) {
    const errors: IUpdateUserProfileError[] = [];

    if (!!user && user.id !== params.userId) {
      errors.push({
        value: params.email,
        msg: 'Email already registered',
        param: 'email',
        location: 'body',
      });
    }

    if (!!phone && phone.userId !== params.userId) {
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
    const newUser = await prisma.user.update({
      where: { id: params.userId },
      data: { email: params.email, name: params.name },
    });

    const newPhone = await prisma.phone.update({
      where: { id: params.userId },
      data: { phone: params.phone },
    });

    return {
      code: StatusCodes.OK,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newPhone.phone,
      },
    };
  }
};

export const profileService = {
  getUserProfile,
  updateUserProfile,
};
