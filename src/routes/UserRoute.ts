import express, { Router } from "express";
import Joi from "joi";
import RequestValidation from "../middlewares/RequestValidation";
import UserController from "../controllers/UserController";
import auth from "../middlewares/auth";

const router: Router = express.Router();

const queryValidationSchema = Joi.object().keys({
  username: Joi.string().optional(),
  email_address: Joi.string().optional(),
  is_penalized: Joi.boolean().optional(),
  penalty_end_date: Joi.date().optional(),
  page: Joi.number().min(1).required(),
  page_size: Joi.number().min(1).required(),
});

const createUserValidationSchema = Joi.object().keys({
  username: Joi.string().required(),
  email_address: Joi.string().required(),
  password: Joi.string().required(),
  is_penalized: Joi.boolean().optional(),
  penalty_end_date: Joi.date().optional(),
});

const paramValidationSchema = Joi.object().keys({
  id: Joi.string().required(),
});

// Routes
router.get(
  "/",
  auth,
  RequestValidation.validateRequest({ query: queryValidationSchema }, "query"),
  UserController.getUserList
);

router.post(
  "/",
  RequestValidation.validateRequest(
    { body: createUserValidationSchema },
    "body"
  ),
  UserController.addUser
);

router.get(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  UserController.getUserDetail
);

router.put(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema, body: createUserValidationSchema },
    "body.params"
  ),
  UserController.editUser
);

router.delete(
  "/:id",
  auth,
  RequestValidation.validateRequest(
    { params: paramValidationSchema },
    "params"
  ),
  UserController.deleteUser
);

export default router;
