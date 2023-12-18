import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema(
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

const Category = mongoose.model("Category", categorySchema);
export default Category;

