import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "fullStackBackendApi",
    })
    .then((c) => console.log(`Database Connected with ${c.connection.host} and ${c.connection.name}`))
    .catch((e) => console.log(e));
};