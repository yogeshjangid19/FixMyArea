// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
      }
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;