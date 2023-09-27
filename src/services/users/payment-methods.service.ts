// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';
import { PaymentType } from '@prisma/client';

interface IGetUserPaymentMethodsParameter {
  userId: number;
}

interface IGetUserPaymentMethodsReturn {
  code: number;
  data: {};
}

interface IAddUserPaymentMethodParameter {
  userId: number;
  paymentType: PaymentType;
}

interface IAddUserPaymentMethodReturn {
  code: number;
  data: {};
}

interface IDeleteUserPaymentMethodParameter {
  userId: number;
  paymentMethodId: string;
}

interface IDeleteUserPaymentMethodReturn {
  code: number;
  data: {};
}

interface IDeleteUserPaymentMethodError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const getUserPaymentMethods = async (
  params: IGetUserPaymentMethodsParameter
): Promise<IGetUserPaymentMethodsReturn> => {
  const paymentMethods = await prisma.paymentMethod.findMany({
    select: { id: true, type: true },
    where: { userId: params.userId },
  });

  return {
    code: StatusCodes.OK,
    data: { paymentMethods },
  };
};

const addUserPaymentMethod = async (
  params: IAddUserPaymentMethodParameter
): Promise<IAddUserPaymentMethodReturn> => {
  const newPaymentMethod = await prisma.paymentMethod.create({
    data: { userId: params.userId, type: params.paymentType },
  });

  return {
    code: StatusCodes.OK,
    data: { id: newPaymentMethod.id, type: newPaymentMethod.type },
  };
};

const deleteUserPaymentMethod = async (
  params: IDeleteUserPaymentMethodParameter
): Promise<IDeleteUserPaymentMethodReturn> => {
  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: { userId: params.userId, id: parseInt(params.paymentMethodId) },
  });

  if (!!paymentMethod) {
    await prisma.paymentMethod.delete({
      where: { id: parseInt(params.paymentMethodId) },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  } else {
    const errors: IDeleteUserPaymentMethodError[] = [
      {
        value: params.paymentMethodId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'paymentMethodId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

export const paymentMethodsService = {
  getUserPaymentMethods,
  addUserPaymentMethod,
  deleteUserPaymentMethod,
};
