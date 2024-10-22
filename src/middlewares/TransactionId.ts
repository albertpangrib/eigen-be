import { Request, Response, NextFunction } from "express";
import Moment from "moment";
import Crypto from "crypto";
import { isV4Format } from "ip";
import Logger from "../helpers/Logger";
import { getDurationInMilliseconds } from "../helpers/DatetimeHelper";

export default (req: Request, res: Response, next: NextFunction): void => {
  const app = "eigen-be--betest";
  const start = Moment();
  const processStart = process.hrtime();
  const timeStamp = start.format("YYYYMMDDHHmmssSSS");
  const normalTime = start.format("YYYY-MM-DD HH:mm:ss.SSS");
  const uniqueId = Crypto.randomBytes(16).toString("hex");
  const transactionId = `${app}${timeStamp}${uniqueId}`;

  // Setting transactionId and startTime on the request object
  req.headers["transactionId"] = transactionId; // Use headers instead of header
  (req as any)["startTime"] = timeStamp; // You may want to define a custom interface for the request if you use this property
  const clientIp = req.ip
    ? isV4Format(req.ip)
      ? req.ip
      : "unknown"
    : "unknown";

  Logger.info({
    transactionId: transactionId,
    status: "started",
    url: req.originalUrl,
    method: req.method,
    ip: clientIp,
    startTime: normalTime,
  });

  res.on("finish", () => {
    const durationInMilliseconds = getDurationInMilliseconds(processStart);
    const endTime = Moment(start)
      .add(durationInMilliseconds, "millisecond")
      .format("YYYY-MM-DD HH:mm:ss.SSS");
    Logger.info({
      transactionId: transactionId,
      status: "finished",
      url: req.originalUrl,
      method: req.method,
      ip: clientIp,
      finishedTime: endTime,
      timeTaken: durationInMilliseconds,
    });
  });

  res.on("close", () => {
    const durationInMilliseconds = getDurationInMilliseconds(processStart);
    const endTime = Moment(start)
      .add(durationInMilliseconds, "millisecond")
      .format("YYYY-MM-DD HH:mm:ss.SSS");
    Logger.info({
      transactionId: transactionId,
      status: "closed",
      url: req.originalUrl,
      method: req.method,
      ip: clientIp,
      closedTime: endTime,
      timeTaken: durationInMilliseconds,
    });
  });

  next();
};
