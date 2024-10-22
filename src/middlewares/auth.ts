import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import BaseResponse from "../response/BaseResponse";
import ENV from "../utils/environment";

interface DecodedToken {
  _id: string;
}

interface UserModel {
  _id: string;
  username: string;
  emailAddress: string;
  tokens: { token: string }[];
}

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: UserModel;
    }
  }
}

const handleErrorResponse = (res: Response, message: string): void => {
  res.status(401).send(BaseResponse.errorResponse(message));
};

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return handleErrorResponse(res, "Token not provided");
  }

  try {
    const decoded = jwt.verify(token, ENV.jwtSecret!) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return handleErrorResponse(res, "User not found");
    }

    const { _id, username, emailAddress, tokens } = user;

    req.token = token;
    req.user = { _id: _id.toString(), username, emailAddress, tokens };

    next();
  } catch (error) {
    handleErrorResponse(res, "Invalid token");
  }
};

export default auth;
