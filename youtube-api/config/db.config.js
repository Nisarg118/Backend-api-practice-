import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw new Error("Error in database connection");
  }
};
