const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoute = require("./routers/authRouter");
const listingRouter = require("./routers/listingRouter");

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/listing", listingRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
