import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser {
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  password: string;
  wishlist_id?: Schema.Types.ObjectId;
  orders_ids?: Schema.Types.ObjectId[];
  reviews_ids?: Schema.Types.ObjectId[];
  userAddress_ids?: Schema.Types.ObjectId[];
}

export interface UserDocument extends IUser, Document {}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    first_name: {
      type: String,
      // required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    wishlist_id: {
      type: Schema.Types.ObjectId,
      ref: "Wishlist",
      default: null,
    },
    orders_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    userAddress_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "User-address",
      },
    ],
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
