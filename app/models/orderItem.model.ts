import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface OrderItem  {
  quantity: number;
  order_id?: Types.ObjectId | null | undefined;
  product_id?: Types.ObjectId | null | undefined;
  sub_total: number;
}

export interface OrderItemDocument extends Document, OrderItem {}

const orderItemSchema = new Schema<OrderItemDocument>(
  {
    quantity: {
      type: Number,
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    sub_total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const OrderItem:Model<OrderItemDocument> = mongoose.model("OrderItem", orderItemSchema);
  export default OrderItem ;