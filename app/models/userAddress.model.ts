import mongoose from "mongoose";
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pin_code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const UserAddress = mongoose.model("User-address", addressSchema);
export default UserAddress;
