import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import ENV from "./utils/environment";
import Logger from "./helpers/Logger";
import Cors from "./middlewares/Cors";
import TransactionId from "./middlewares/TransactionId";
import {
  connectMongoDb,
  config as mongoConfig,
} from "./services/MongoDbService";
import AuthRoute from "./routes/AuthRoute";
import UserRoute from "./routes/UserRoute";
import BookRoute from "./routes/BookRoute";
import BorrowRecordRoute from "./routes/BorrowRecordRoute";

const app: Application = express();
const PORT: number =
  process.env.PORT != null ? parseInt(process.env.PORT) : 8080;
const API_PATH: string = ENV.apiPath || "";
const BASE_PATH = API_PATH ? `/${API_PATH}` : "";
const BASE_URL = `localhost:${PORT}${BASE_PATH}`;

const server = app.listen(PORT, async () => {
  try {
    await connectMongoDb();
    Logger.info(`App Base Url: ${BASE_URL}`);
    Logger.info(`Communicating to DB: ${ENV.mongoLiveDb}`);
  } catch (err) {
    Logger.error(err);
  }
});

app.use(TransactionId as NextFunction);
app.use(Cors as NextFunction);
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(`${BASE_PATH}/auth`, AuthRoute);
app.use(`${BASE_PATH}/user`, UserRoute);
app.use(`${BASE_PATH}/book`, BookRoute);
app.use(`${BASE_PATH}/borrow_record`, BorrowRecordRoute);

app.use((req: Request, res: Response) => {
  res.status(404).send({ error: "Not Found" });
});

const stopServer = (): void => {
  server.close((err) => {
    Logger.info("Server: Exit", { err });
  });
};

process.on("exit", () => {
  stopServer();
});

process.on("SIGINT", () => {
  stopServer();
});

process.on("uncaughtException", (err: Error) => {
  if (err) Logger.error(err);
  Logger.info("uncaughtException: Exit");
  stopServer();
  process.exit(99);
});
