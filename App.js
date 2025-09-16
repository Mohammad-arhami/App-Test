const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");

const app = express();

dotenv.config();

const dbURI= "mongodb+srv://mohammad:20050902@test.qic38.mongodb.net/?retryWrites=true&w=majority&appName=Test";
mongoose
  .connect(dbURI)
  .then((result) => console.log("Mongo Db Is Connected!"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth" , authRouter);
app.use("/api/user" , userRouter);


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})


// ! Middleware for handling error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message + "fuckkkkkk" || "Interval Server Error";

  console.log(err.message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});