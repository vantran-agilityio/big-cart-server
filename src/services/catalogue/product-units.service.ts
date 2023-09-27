// Libraries
import { StatusCodes } from 'http-status-codes';

// Model
import { ProductUnit } from '@prisma/client';

// Prisma
import prisma from 'src/prisma';

interface ICreateProductUnitParameter {
  name: string;
}

interface IGetProductUnitReturn {
  code: number;
  data: { productUnits: ProductUnit[] };
}

interface ICreateProductUnitReturn {
  code: number;
  data: ProductUnit | { errors?: ICreateProductUnitError[] };
}

interface ICreateProductUnitError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

const getProductUnitList = async (): Promise<IGetProductUnitReturn> => {
  const productUnits = await prisma.productUnit.findMany();

  return {
    code: StatusCodes.OK,
    data: { productUnits },
  };
};

const createProductUnit = async (
  params: ICreateProductUnitParameter
): Promise<ICreateProductUnitReturn> => {
  const productUnit = await prisma.productUnit.findFirst({
    where: { name: params.name },
  });

  if (!!productUnit) {
    const errors: ICreateProductUnitError[] = [
      {
        value: params.name,
        msg: 'Name already registered',
        param: 'name',
        location: 'body',
      },
    ];

    return {
      code: StatusCodes.CONFLICT,
      data: { errors },
    };
  } else {
    const newProductUnit = await prisma.productUnit.create({
      data: { name: params.name },
    });

    return {
      code: StatusCodes.OK,
      data: newProductUnit,
    };
  }
};

export const productUnitsService = {
  getProductUnitList,
  createProductUnit,
};
