import { Request, Response } from "express";
import _ from "lodash";
import BaseResponse from "../response/BaseResponse";
import Logger from "../helpers/Logger";
import GetBookListResponse from "../response/GetBookListResponse";
import GetBookDetailResponse from "../response/GetBookDetailResponse";
import PaginationHelper from "../helpers/PaginationHelper";
import Book from "../models/Book";

interface Book {
  title: string;
  author: string;
  quantity: number;
  availableQuantity: number;
}

export const getBookList = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    query: { title, author, quantity, available_quantity, page, page_size },
  } = req;

  try {
    const result: any = await Book.find(
      {
        ...(title && { title }),
        ...(author && { author }),
        ...(quantity && { quantity }),
        ...(available_quantity && { availableQuantity: available_quantity }),
      },
      null,
      {
        skip: PaginationHelper(page as string, page_size as string),
        limit: parseInt(page_size as string, 10),
      }
    );

    const response = GetBookListResponse(result);

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
  const {
    body: { title, author, quantity, available_quantity },
  } = req;

  try {
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      res.status(400).send(BaseResponse.errorResponse("Book already exists"));
      return;
    }
    await Book.create({
      title,
      author,
      quantity,
      availableQuantity: available_quantity,
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const getBookDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const result: any = await Book.findById(id);
    if (!result) {
      res.status(404).send(BaseResponse.errorResponse("Book not found"));
      return;
    }

    const response = GetBookDetailResponse(result);

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const editBook = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.params;
  const { title, author, quantity, available_quantity } = req.body;

  try {
    await Book.findByIdAndUpdate(_id, {
      ...(title && { title }),
      ...(author && { author }),
      ...(quantity && { quantity }),
      ...(available_quantity && { availableQuantity: available_quantity }),
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await Book.findByIdAndDelete(id);
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export default {
  getBookList,
  addBook,
  getBookDetail,
  editBook,
  deleteBook,
};
