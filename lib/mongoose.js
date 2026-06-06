import mongoose from "mongoose";
import logger from "./logger";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not defined");
}

const dbConnect = async () => {
  await mongoose
    .connect(MONGO_URI, {
      dbName: "devFloww",
    })
    .then((response) => {
      logger.info("Connect to the Database !!");
      return response;
    })
    .catch((error) => {
      logger.error("Error connecting to MongoDB", error);
      throw error;
    });
  // console.log(mongoose.connection.readyState);
};

export default dbConnect;
