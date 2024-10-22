import { Request, Response, NextFunction } from "express";
import BaseResponse from "../response/BaseResponse";

interface ValidationSchema {
  [key: string]: {
    validate: (
      value: any,
      schema: any,
    ) => { error?: { details: { message: string }[] } };
  };
}

const validateRequest = (schema: ValidationSchema, properties: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const splittedProperties = properties.split(".");
    let errList = "";

    for (const property of splittedProperties) {
      const schemaPart = schema[property];
      if (schemaPart) {
        const reqPart = (req as any)[property];
        const { error } = schemaPart.validate(reqPart, schema);
        if (error) {
          const { details } = error;
          const message = details.map((i) => i.message).join(",");
          errList += message + ", ";
        }
      } else {
        errList += `Property '${property}' is not valid. `;
      }
    }

    if (!errList) {
      next();
    } else {
      res.status(400).send(BaseResponse.errorResponse(errList.trim())); // Trim the trailing comma and space
    }
  };
};

export default {
  validateRequest,
};
