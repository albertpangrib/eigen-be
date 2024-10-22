import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const ENV = {
  port: process.env.PORT,
  apiPath: process.env.API_PATH,
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbName: process.env.MONGODB_DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpriresIn: process.env.JWT_EXPIRES_IN,
  mongoLiveDb: process.env.MONGO_LIVE_DB,
};

export default ENV;
