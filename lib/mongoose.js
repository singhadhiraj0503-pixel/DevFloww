import mongoose from "mongoose";

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
      console.log("Connect to the Database !!");
      return response;
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
      throw error;
    });
  console.log(mongoose.connection.readyState);
};

export default dbConnect;
