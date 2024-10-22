import express, { Router } from "express";
import Joi from "joi";
import RequestValidation from "../middlewares/RequestValidation";
import BorrowRecordController from "../controllers/BorrowRecordController";
import auth from "../middlewares/auth";

const router: Router = express.Router();

const queryValidationSchema = Joi.object().keys({
  user_id: Joi.string().optional(),
  book_id: Joi.string().optional(),
  borrowed_at: Joi.date().optional(),
  due_date: Joi.date().optional(),
  returned_at: Joi.date().optional(),
  status: Joi.date().optional(),
  page: Joi.number().min(1).required(),
  page_size: Joi.number().min(1).required(),
});

const createBorrowRecordValidationSchema = Joi.object().keys({
  book_id: Joi.string(),
  status: Joi.string(),
  returned_at: Joi.date(),
});

const paramValidationSchema = Joi.object().keys({
  id: Joi.string().required(),
});

router.get(
  "/",
  auth,
  RequestValidation.validateRequest({ query: queryValidationSchema }, "query"),
  BorrowRecordController.getBorrowRecordList
);

router.post(
  "/",
  auth,
  RequestValidation.validateRequest(
    { body: createBorrowRecordValidationSchema },
    "body"
  ),
  BorrowRecordController.addBorrowRecord
);

router.get(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  BorrowRecordController.getBorrowRecordDetail
);

router.put(
  "/",
  auth,
  RequestValidation.validateRequest(
    { body: createBorrowRecordValidationSchema },
    "body"
  ),
  BorrowRecordController.editBorrowRecord
);

router.delete(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  BorrowRecordController.deleteBorrowRecord
);

export default router;
