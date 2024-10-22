import { Request, Response } from "express";
import _ from "lodash";
import User from "../models/User";
import BaseResponse from "../response/BaseResponse";
import Logger from "../helpers/Logger";
import GetUserListResponse from "../response/GetUserListResponse";
import GetUserDetailResponse from "../response/GetUserDetailResponse";
import PaginationHelper from "../helpers/PaginationHelper";
import BorrowRecord from "../models/BorrowRecord";

interface User {
  username: string;
  emailAddress: string;
  password: string;
  isPenalized: boolean;
  penaltyEndDate: Date;
}

export const getUserList = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    query: {
      username,
      email_address,
      is_penalized,
      penalty_end_date,
      page,
      page_size,
    },
  } = req;

  try {
    const result: any = await User.find(
      {
        ...(username && { username }),
        ...(email_address && { emailAddress: email_address }),
        ...(is_penalized && { isPenalized: is_penalized }),
        ...(penalty_end_date && { penaltyEndDate: penalty_end_date }),
      },
      null,
      {
        skip: PaginationHelper(page as string, page_size as string),
        limit: parseInt(page_size as string, 10),
      }
    );

    const response = GetUserListResponse(result);

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const {
    body: { username, email_address, password, is_penalized, penalty_end_date },
  } = req;

  try {
    await User.create({
      username,
      emailAddress: email_address,
      password,
      isPenalized: is_penalized,
      penaltyEndDate: penalty_end_date,
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const getUserDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const result: any = await User.findById(id);
    if (!result) {
      res.status(404).send(BaseResponse.errorResponse("User not found"));
      return;
    }

    const response = GetUserDetailResponse(result);

    Logger.info(response);
    res.send(BaseResponse.successResponse(response));
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { _id } = req.params;
  const { username, email_address, password, is_penalized, penalty_end_date } =
    req.body;

  try {
    await User.findByIdAndUpdate(_id, {
      ...(username && { username }),
      ...(email_address && { emailAddress: email_address }),
      ...(password && { password }),
      ...(is_penalized && { isPenalized: is_penalized }),
      ...(penalty_end_date && { penaltyEndDate: penalty_end_date }),
    });
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.send(BaseResponse.successResponse());
  } catch (error) {
    const statusCode = (error as any).errorCode || 500;
    Logger.error(error);
    res.status(statusCode).send(BaseResponse.errorResponse(error));
  }
};

export default {
  getUserList,
  addUser,
  getUserDetail,
  editUser,
  deleteUser,
};
