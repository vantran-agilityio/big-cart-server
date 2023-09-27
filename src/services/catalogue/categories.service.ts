// Libraries
import { StatusCodes } from 'http-status-codes';

// Model
import { Category } from '@prisma/client';

// Prisma
import prisma from 'src/prisma';

type ParsedCategory = Category & { image: string };

interface ICreateCategoryParameter {
  name: string;
}

interface IGetCategoryListReturn {
  code: number;
  data: { categories: ParsedCategory[] };
}

interface ICreateCategoryReturn {
  code: number;
  data: ParsedCategory | { errors?: ICreateCategoryError[] };
}

interface ICreateCategoryError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

const getCategoryList = async (): Promise<IGetCategoryListReturn> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      image: { select: { url: true } },
    },
  });

  const parsedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    image: category!.image!.url,
  }));

  return {
    code: StatusCodes.OK,
    data: { categories: parsedCategories },
  };
};

const createCategory = async (
  params: ICreateCategoryParameter
): Promise<ICreateCategoryReturn> => {
  const category = await prisma.category.findFirst({
    where: { name: params.name },
  });

  if (!!category) {
    const errors: ICreateCategoryError[] = [
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
    const mockImage = 'https://via.placeholder.com/150';

    const newCategory = await prisma.category.create({
      data: { name: params.name },
    });

    const nameImage = await prisma.image.create({
      data: { categoryId: newCategory.id, url: mockImage },
    });

    return {
      code: StatusCodes.OK,
      data: { ...newCategory, image: nameImage.url },
    };
  }
};

export const categoriesService = {
  getCategoryList,
  createCategory,
};
