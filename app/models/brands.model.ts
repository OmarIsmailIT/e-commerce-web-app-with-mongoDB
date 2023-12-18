import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
