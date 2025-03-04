const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    process.env.NODE_ENV === "development" &&
      console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
