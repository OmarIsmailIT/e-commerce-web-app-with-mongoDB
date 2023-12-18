import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    short_description: {
      type: String,
      required: false,
    },
    category_Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    brand_Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;


