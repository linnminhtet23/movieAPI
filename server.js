const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const movieRouter = require("./routes/movieRoutes");
const castRouter = require("./routes/castRoute");
const ratelimit = require("express-rate-limit");
const path = require("path");
const app = express();

const PORT = 3000 || process.env.PORT;

require("dotenv").config();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(
  ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());

//Routes
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);
app.use("/api/cast", castRouter);
//To render Image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Mongodb connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Database Connected");
  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
});
