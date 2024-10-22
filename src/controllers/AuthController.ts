import { Request, Response } from "express";
import User from "../models/User";
import BaseResponse from "../response/BaseResponse";
import Logger from "../helpers/Logger";

interface LoginRequestBody {
  username: string;
  password: string;
}

const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();

    Logger.info(token);
    res
      .setHeader("Authorization", `Bearer ${token}`)
      .send(BaseResponse.successResponse());
  } catch (err) {
    Logger.error(err);
    res
      .status((err as any).errorCode || 500)
      .send(BaseResponse.errorResponse(err));
  }
};

export default {
  login,
};
