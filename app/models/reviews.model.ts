import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    product_Id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    user_Id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Reviews = mongoose.model("Review", reviewSchema);
export default Reviews;
