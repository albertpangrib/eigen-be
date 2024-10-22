import express, { Router } from "express";
import Joi from "joi";
import RequestValidation from "../middlewares/RequestValidation";
import BookController from "../controllers/BookController";
import auth from "../middlewares/auth";

const router: Router = express.Router();

const queryValidationSchema = Joi.object().keys({
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  quantity: Joi.number().optional(),
  available_quantity: Joi.number().optional(),
  page: Joi.number().min(1).required(),
  page_size: Joi.number().min(1).required(),
});

const createBookValidationSchema = Joi.object().keys({
  title: Joi.string().required(),
  author: Joi.string().required(),
  quantity: Joi.number().required(),
  available_quantity: Joi.number().required(),
});

const paramValidationSchema = Joi.object().keys({
  id: Joi.string().required(),
});

router.get(
  "/",
  auth,
  RequestValidation.validateRequest({ query: queryValidationSchema }, "query"),
  BookController.getBookList
);

router.post(
  "/",
  RequestValidation.validateRequest(
    { body: createBookValidationSchema },
    "body"
  ),
  BookController.addBook
);

router.get(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  BookController.getBookDetail
);

router.put(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema, body: createBookValidationSchema },
    "body.params"
  ),
  BookController.editBook
);

router.delete(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  BookController.deleteBook
);

export default router;
