import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface WishlistItem {
  product_id: Types.ObjectId[];
  user_id: Types.ObjectId;
}

export interface WishlistDocument extends Document, WishlistItem {}

const wishlistSchema = new Schema<WishlistDocument>(
  {
    product_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist: Model<WishlistDocument> = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
