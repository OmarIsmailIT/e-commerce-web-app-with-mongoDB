"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
var orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
}, {
    timestamps: true, // Add timestamps option
});
var Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
