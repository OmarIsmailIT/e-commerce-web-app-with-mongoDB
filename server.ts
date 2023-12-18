import { Application, Request, Response } from "express";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import productRouter from "./app/routers/product.route";
import loginRouter from "./app/routers/login.route";
import orderRouter from "./app/routers/order.route";
import userRouter from "./app/routers/user.route";
import addressRouter from "./app/routers/address.route";
import brandRouter from "./app/routers/brand.route";
import categoryRouter from "./app/routers/category.route";
import signupRouter from "./app/routers/signup.route";
import wishlistRouter from "./app/routers/wishlist.route";
const mongoose = require("mongoose");
const connectDB = require("./app/config/db.config");
const passport = require("passport"); // Import Passport.js
import "./app/config/passport.config";

// connect to mongodb
connectDB();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.use(passport.initialize()); // Initialize Passport.js

app.use("/api/v1/products", productRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/wishlist", wishlistRouter);

const Port = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(Port, () => {
    console.log(`Server is running on ${Port}`);
  });
});
