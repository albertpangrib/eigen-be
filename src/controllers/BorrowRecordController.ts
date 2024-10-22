import { Request, Response } from "express";
import _ from "lodash";
import BorrowRecord from "../models/BorrowRecord";
import Book from "../models/Book";
import User from "../models/User";
import mongoose from "mongoose";
import BaseResponse from "../response/BaseResponse";
import Logger from "../helpers/Logger";
import GetBorrowRecordListResponse from "../response/GetBorrowRecordListResponse";
import GetUserBorrowBooksResponse from "../response/GetUserBorrowBooksResponse";
import PaginationHelper from "../helpers/PaginationHelper";

interface BorrowRecord {
  userId: string;
  bookId: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date;
  status: "borrowed" | "returned";
}

export const getBorrowRecordList = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    query: {
      user_id,
      book_id,
      borrowed_at,
      due_date,
      returned_at,
      status,
      page,
      page_size,
    },
  } = req;

  try {
    const result: any = await BorrowRecord.find(
      {
        ...(user_id && { userId: user_id }),
        ...(book_id && { bookId: book_id }),
        ...(borrowed_at && { borrowedAt: borrowed_at }),
        ...(due_date && { dueDate: due_date }),
        ...(returned_at && { returnedAt: returned_at }),
        ...(status && { status }),
      },
      null,
      {
        skip: PaginationHelper(page as string, page_size as string),
        limit: parseInt(page_size as string, 10),
      }
    );

    const response = GetBorrowRecordListResponse(result);

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const addBorrowRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = req.user?._id;

  const {
    body: { book_id },
  } = req;
  try {
    const book = await Book.findById(book_id);

    if (!book) {
      res.status(404).send(BaseResponse.errorResponse("Book not found"));
      return;
    }
    // Members may not borrow more than 2 books
    const currentBorrowedBooksCount = await BorrowRecord.countDocuments({
      userId: user_id,
      status: "borrowed",
    });
    if (currentBorrowedBooksCount >= 2) {
      res
        .status(400)
        .send(BaseResponse.errorResponse("Cannot borrow more than 2 books"));
      return;
    }

    // Borrowed books are not borrowed by other members
    if (book.availableQuantity <= 0) {
      res
        .status(400)
        .send(BaseResponse.errorResponse("Book is being borrowed"));
      return;
    }
    // Member is currently not being penalized
    const user = await User.findById(user_id);
    if (user?.isPenalized === "yes") {
      res
        .status(400)
        .send(
          BaseResponse.errorResponse(
            "You are currently penalized and cannot borrow books, wait until 3 days penalized"
          )
        );
      return;
    }

    const bookIsBorrowed = await BorrowRecord.findOne({
      bookId: book_id,
      status: "borrowed",
    });

    if (bookIsBorrowed) {
      res
        .status(400)
        .send(
          BaseResponse.errorResponse(
            "This book is currently borrowed by another member"
          )
        );
      return;
    }

    book.availableQuantity -= 1;
    await book.save();

    const borrowedAt = new Date();
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + 7);

    await BorrowRecord.create({
      userId: new mongoose.Types.ObjectId(user_id).toString(),
      bookId: book_id,
      borrowedAt,
      dueDate,
      status: "borrowed",
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const getBorrowRecordDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send(BaseResponse.errorResponse("User not found"));
      return;
    }

    const borrowRecords = await BorrowRecord.find({
      userId: id,
      status: "borrowed",
    });

    if (!borrowRecords || borrowRecords.length === 0) {
      res
        .status(404)
        .send(
          BaseResponse.errorResponse("No borrowed books found for the user")
        );
      return;
    }

    const borrowedBooks = await Promise.all(
      borrowRecords.map(async (record) => {
        const book = await Book.findById(record.bookId);
        return {
          _id: book?.id.toString() || "Unknown",
          title: book?.title || "Unknown Title",
          borrowed_at: record.borrowedAt,
          due_date: record.dueDate,
          status: record.status,
        };
      })
    );

    const response = GetUserBorrowBooksResponse(
      user,
      borrowRecords,
      borrowedBooks
    );

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const editBorrowRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user_id = req.user?._id;
  const { book_id } = req.body;
  console.log(book_id);

  try {
    const borrowRecord = await BorrowRecord.findOne({
      userId: user_id,
      bookId: book_id,
      status: "borrowed",
    });
    if (!borrowRecord) {
      res
        .status(404)
        .send(BaseResponse.errorResponse("Borrow record not found"));
      return;
    }
    const _id = borrowRecord?._id;
    const currentDate = new Date();
    const borrowed_at = borrowRecord.borrowedAt;
    const status = "returned";
    const returned_at = new Date();
    const daysBorrowed: number = Math.ceil(
      (returned_at.getTime() - borrowed_at.getTime()) / (1000 * 3600 * 24)
    );
    const due_date = borrowRecord.dueDate;
    if (currentDate > due_date) {
      const penaltyEndDate = new Date(currentDate);
      penaltyEndDate.setDate(currentDate.getDate() + 3);
      await User.updateOne(
        { _id: user_id },
        { isPenalized: "yes" },
        penaltyEndDate
      );
    }

    const book = await Book.findById(book_id);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    await BorrowRecord.findByIdAndUpdate(_id, {
      ...(status && { status }),
      ...(returned_at && { returnedAt: returned_at }),
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const deleteBorrowRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { _id } = req.params;

  try {
    await BorrowRecord.findByIdAndDelete(_id);
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export default {
  getBorrowRecordList,
  addBorrowRecord,
  getBorrowRecordDetail,
  editBorrowRecord,
  deleteBorrowRecord,
};
