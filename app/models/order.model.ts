import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming there's a User model
      required: true,
    },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: "User_Address", // Assuming there's an Address model
    },
    status: {
      type: String,
      enum: ["in_cart", "placed", "paid", "canceled"],
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    order_items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
