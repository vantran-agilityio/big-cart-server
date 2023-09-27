// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IGetUserFavoriteItemsParameter {
  userId: number;
}

interface IGetUserFavoriteItemsReturn {
  code: number;
  data: {};
}

interface IAddUserFavoriteItemParameter {
  userId: number;
  productId: number;
}

interface IAddUserFavoriteItemReturn {
  code: number;
  data: {};
}

interface IAddUserFavoriteItemError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

interface IDeleteUserFavoriteItemParameter {
  userId: number;
  favoriteItemId: string;
}

interface IDeleteUserFavoriteItemReturn {
  code: number;
  data: {};
}

interface IDeleteUserFavoriteItemError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const getUserFavoriteItems = async (
  params: IGetUserFavoriteItemsParameter
): Promise<IGetUserFavoriteItemsReturn> => {
  const favoriteItems = await prisma.favoriteItem.findMany({
    select: { id: true, productId: true },
    where: { userId: params.userId },
  });

  return {
    code: StatusCodes.OK,
    data: { favoriteItems },
  };
};

const addUserFavoriteItem = async (
  params: IAddUserFavoriteItemParameter
): Promise<IAddUserFavoriteItemReturn> => {
  const product = await prisma.product.findFirst({
    where: { id: params.productId },
  });

  const favoriteItem = await prisma.favoriteItem.findFirst({
    where: { userId: params.userId, productId: params.productId },
  });

  if (!!favoriteItem) {
    const errors: IAddUserFavoriteItemError[] = [
      {
        value: params.productId,
        msg: 'Product already selected',
        param: 'productId',
        location: 'body',
      },
    ];

    return {
      code: StatusCodes.CONFLICT,
      data: { errors },
    };
  } else if (!favoriteItem && !!product) {
    const newFavoriteItem = await prisma.favoriteItem.create({
      data: { userId: params.userId, productId: params.productId },
    });

    return {
      code: StatusCodes.OK,
      data: { id: newFavoriteItem.id, productId: newFavoriteItem.productId },
    };
  } else {
    const errors: IAddUserFavoriteItemError[] = [
      {
        value: params.productId,
        msg: 'Product does not exist',
        param: 'productId',
        location: 'body',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

const deleteUserFavoriteItem = async (
  params: IDeleteUserFavoriteItemParameter
): Promise<IDeleteUserFavoriteItemReturn> => {
  const favoriteItem = await prisma.favoriteItem.findFirst({
    where: { userId: params.userId, id: parseInt(params.favoriteItemId) },
  });

  if (!!favoriteItem) {
    await prisma.favoriteItem.delete({
      where: { id: parseInt(params.favoriteItemId) },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  } else {
    const errors: IDeleteUserFavoriteItemError[] = [
      {
        value: params.favoriteItemId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'favoriteItemId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

export const favoriteItemsService = {
  getUserFavoriteItems,
  addUserFavoriteItem,
  deleteUserFavoriteItem,
};
