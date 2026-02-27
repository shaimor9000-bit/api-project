require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Routers
const productRouter = require("./api/v1/routes/product");
const authRouter = require("./api/v1/routes/auth");
const cartRouter = require("./api/v1/routes/cart");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "api", "v1", "views")));

// MongoDB Connection
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoServer = process.env.MONGO_SERVER;
const mongoDb = process.env.MONGO_DB;

const mongoConnstr =
  `mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/${mongoDb}?retryWrites=true&w=majority&appName=Ecomm`;

mongoose.connect(mongoConnstr)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

module.exports = app;