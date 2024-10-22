import { Router } from "express";
import Joi from "joi";
import RequestValidation from "../middlewares/RequestValidation";
import AuthController from "../controllers/AuthController";

const router = Router();

const loginValidationSchema = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

router.post(
  "/login",
  RequestValidation.validateRequest({ body: loginValidationSchema }, "body"),
  AuthController.login,
);

export default router;
