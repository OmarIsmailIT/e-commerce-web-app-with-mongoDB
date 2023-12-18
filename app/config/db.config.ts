const mongoose = require("mongoose");
const db = "e-commerces";
const url = `mongodb+srv://omarism65:0595334880@cluster0.6r6d6wo.mongodb.net/${db}?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
    mongoose.connection.on("error", (error: Error) => {
      console.error("Mongoose connection error:", error);
    });

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    mongoose.connection.on("close", () => {
      console.log("Mongoose connection closed");
    });

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
