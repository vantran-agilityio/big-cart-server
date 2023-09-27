// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IGetUserAddressesParameter {
  userId: number;
}

interface IGetUserAddressesReturn {
  code: number;
  data: {};
}

interface IAddUserAddressParameter {
  userId: number;
  recipientName: string;
  address: string;
  city: string;
  zipCode: number;
  country: string;
  phone: string;
  default: boolean;
}

interface IAddUserAddressReturn {
  code: number;
  data: {};
}

interface IUpdateUserAddressParameter {
  userId: number;
  addressId: string;
  recipientName: string;
  address: string;
  city: string;
  zipCode: number;
  country: string;
  phone: string;
  default: boolean;
}

interface IUpdateUserAddressReturn {
  code: number;
  data: {};
}

interface IDeleteUserAddressParameter {
  userId: number;
  addressId: string;
}

interface IDeleteUserAddressReturn {
  code: number;
  data: {};
}

interface IDeleteUserAddressError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const getUserAddresses = async (
  params: IGetUserAddressesParameter
): Promise<IGetUserAddressesReturn> => {
  const addresses = await prisma.address.findMany({
    select: {
      id: true,
      recipientName: true,
      address: true,
      city: true,
      zipCode: true,
      country: true,
      default: true,
      createdAt: true,
      updatedAt: true,
      phone: { select: { phone: true } },
    },
    where: { userId: params.userId },
  });

  const parsedAddresses = addresses.map((address) => ({
    id: address.id,
    recipientName: address.recipientName,
    address: address.address,
    city: address.city,
    zipCode: address.zipCode,
    country: address.country,
    default: address.default,
    phone: address.phone!.phone,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  }));

  return {
    code: StatusCodes.OK,
    data: { addresses: parsedAddresses },
  };
};

const addUserAddress = async (
  params: IAddUserAddressParameter
): Promise<IAddUserAddressReturn> => {
  const newAddress = await prisma.address.create({
    data: {
      userId: params.userId,
      recipientName: params.recipientName,
      address: params.address,
      city: params.city,
      zipCode: params.zipCode,
      country: params.country,
      default: params.default,
    },
  });

  const newPhone = await prisma.phone.create({
    data: {
      addressId: newAddress.id,
      phone: params.phone,
    },
  });

  return {
    code: StatusCodes.OK,
    data: {
      id: newAddress.id,
      recipientName: newAddress.recipientName,
      address: newAddress.address,
      city: newAddress.city,
      zipCode: newAddress.zipCode,
      country: newAddress.country,
      default: newAddress.default,
      phone: newPhone.phone,
      createdAt: newAddress.createdAt,
      updatedAt: newAddress.updatedAt,
    },
  };
};

const updateUserAddress = async (
  params: IUpdateUserAddressParameter
): Promise<IUpdateUserAddressReturn> => {
  const address = await prisma.address.findFirst({
    where: { userId: params.userId, id: parseInt(params.addressId) },
  });

  if (!!address) {
    const newAddress = await prisma.address.update({
      data: {
        recipientName: params.recipientName,
        address: params.address,
        city: params.city,
        zipCode: params.zipCode,
        country: params.country,
        default: params.default,
      },
      where: { id: parseInt(params.addressId) },
    });

    const newPhone = await prisma.phone.update({
      data: { phone: params.phone },
      where: { addressId: newAddress.id },
    });

    return {
      code: StatusCodes.OK,
      data: {
        id: newAddress.id,
        recipientName: newAddress.recipientName,
        address: newAddress.address,
        city: newAddress.city,
        zipCode: newAddress.zipCode,
        country: newAddress.country,
        default: newAddress.default,
        phone: newPhone.phone,
        createdAt: newAddress.createdAt,
        updatedAt: newAddress.updatedAt,
      },
    };
  } else {
    const errors: IDeleteUserAddressError[] = [
      {
        value: params.addressId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'addressId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

const deleteUserAddress = async (
  params: IDeleteUserAddressParameter
): Promise<IDeleteUserAddressReturn> => {
  const address = await prisma.address.findFirst({
    where: { userId: params.userId, id: parseInt(params.addressId) },
  });

  if (!!address) {
    await prisma.address.delete({
      where: { id: parseInt(params.addressId) },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  } else {
    const errors: IDeleteUserAddressError[] = [
      {
        value: params.addressId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'addressId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

export const addressesService = {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
