// Libraries
import { StatusCodes } from 'http-status-codes';

// Prisma
import prisma from 'src/prisma';

interface IGetUserCartItemsParameter {
  userId: number;
}

interface IGetUserCartItemsReturn {
  code: number;
  data: {};
}

interface IAddUserCartItemParameter {
  userId: number;
  productId: number;
}

interface IAddUserCartItemReturn {
  code: number;
  data: {};
}

interface IAddUserCartItemError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

interface IUpdateUserCartItemParameter {
  userId: number;
  cartItemId: string;
  quantity: number;
}

interface IUpdateUserCartItemReturn {
  code: number;
  data: {};
}

interface IUpdateUserCartItemError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

interface IDeleteUserCartItemParameter {
  userId: number;
  cartItemId: string;
}

interface IDeleteUserCartItemReturn {
  code: number;
  data: {};
}

interface IDeleteUserCartItemError {
  value: string | number;
  msg: string;
  param: string;
  location: string;
}

const getUserCartItems = async (
  params: IGetUserCartItemsParameter
): Promise<IGetUserCartItemsReturn> => {
  const cartItems = await prisma.cartItem.findMany({
    select: { id: true, productId: true, quantity: true },
    where: { userId: params.userId },
  });

  return {
    code: StatusCodes.OK,
    data: { cartItems },
  };
};

const addUserCartItem = async (
  params: IAddUserCartItemParameter
): Promise<IAddUserCartItemReturn> => {
  const product = await prisma.product.findFirst({
    where: { id: params.productId },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: { userId: params.userId, productId: params.productId },
  });

  if (!!cartItem) {
    const errors: IAddUserCartItemError[] = [
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
  } else if (!cartItem && !!product) {
    if (product.quantityStock > 1) {
      const newCartItem = await prisma.cartItem.create({
        data: {
          userId: params.userId,
          productId: params.productId,
          quantity: 1,
        },
      });

      return {
        code: StatusCodes.OK,
        data: {
          id: newCartItem.id,
          productId: newCartItem.productId,
          quantity: newCartItem.quantity,
        },
      };
    } else {
      const errors: IUpdateUserCartItemError[] = [
        {
          value: params.productId,
          msg: 'Product is out of stock',
          param: 'productId',
          location: 'body',
        },
      ];

      return {
        code: StatusCodes.OK,
        data: { errors },
      };
    }
  } else {
    const errors: IAddUserCartItemError[] = [
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

const updateUserCartItem = async (
  params: IUpdateUserCartItemParameter
): Promise<IUpdateUserCartItemReturn> => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { userId: params.userId, id: parseInt(params.cartItemId) },
  });

  if (!!cartItem) {
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });

    if (!!product && product.quantityStock > params.quantity) {
      const newCartItem = await prisma.cartItem.update({
        data: { quantity: params.quantity },
        where: { id: parseInt(params.cartItemId) },
      });

      return {
        code: StatusCodes.OK,
        data: newCartItem,
      };
    } else {
      const errors: IUpdateUserCartItemError[] = [
        {
          value: params.quantity,
          msg: 'Product is out of stock',
          param: 'quantity',
          location: 'body',
        },
      ];

      return {
        code: StatusCodes.OK,
        data: { errors },
      };
    }
  } else {
    const errors: IUpdateUserCartItemError[] = [
      {
        value: params.cartItemId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'cartItemId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

const deleteUserCartItem = async (
  params: IDeleteUserCartItemParameter
): Promise<IDeleteUserCartItemReturn> => {
  const cartItem = await prisma.cartItem.findFirst({
    where: { userId: params.userId, id: parseInt(params.cartItemId) },
  });

  if (!!cartItem) {
    await prisma.cartItem.delete({
      where: { id: parseInt(params.cartItemId) },
    });

    return {
      code: StatusCodes.OK,
      data: {},
    };
  } else {
    const errors: IDeleteUserCartItemError[] = [
      {
        value: params.cartItemId,
        msg: 'Item does not exist. It may have been deleted',
        param: 'cartItemId',
        location: 'params',
      },
    ];

    return {
      code: StatusCodes.NOT_FOUND,
      data: { errors },
    };
  }
};

export const cartItemsService = {
  getUserCartItems,
  addUserCartItem,
  updateUserCartItem,
  deleteUserCartItem,
};
