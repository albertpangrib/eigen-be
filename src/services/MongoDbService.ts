import mongoose from "mongoose";
import ENV from "../utils/environment";

interface Config {
  url: string | undefined;
  dbName: string | undefined;
  mongoDbUrlLive: string | undefined;
}

const config: Config = {
  url: ENV.mongoDbUrl!,
  dbName: ENV.mongoDbName!,
  mongoDbUrlLive: ENV.mongoLiveDb!,
};

const connectMongoDb = async (): Promise<void> => {
  if (!config.mongoDbUrlLive) {
    throw new Error("MongoDB URL is not defined");
  }

  await mongoose.connect(config.mongoDbUrlLive);
};

export { config, connectMongoDb };
