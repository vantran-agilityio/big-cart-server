// Libraries
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Model
import { User } from '@prisma/client';

// Service
import { productsService, ORDER_DIRECTIONS } from 'src/services/catalogue';

// Product List
const getProductList = async (req: Request, res: Response) => {
  try {
    const result = await productsService.getProductList({
      categoryId: req.query.categoryId as string,
      limit: req.query.limit as string,
      page: req.query.page as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      orderBy: req.query.orderBy as ORDER_DIRECTIONS,
      minPrice: req.query.minPrice as string,
      maxPrice: req.query.maxPrice as string,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await productsService.createProduct({
      categoryId: req.body.categoryId,
      productUnitId: req.body.productUnitId,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantityStock: req.body.quantityStock,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

// Product Detail
const getProduct = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await productsService.getProduct({
      productId: req.params.productId,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

// Product Review
const getProductReviewList = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await productsService.getProductReviewList({
      productId: req.params.productId,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

const createProductReview = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const result = await productsService.createProductReview({
      userId: (req.user as User).id,
      productId: req.params.productId,
      rating: req.body.rating,
      description: req.body.description,
    });

    res.status(result.code).json(result.data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: (error as Error).message });
  }
};

export const productsController = {
  getProductList,
  createProduct,
  getProductReviewList,
  createProductReview,
  getProduct,
};
