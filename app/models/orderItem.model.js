"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var orderItemSchema = new mongoose_1.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    order_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
    },
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
    },
    sub_total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true, // Add timestamps option
});
var OrderItem = mongoose_1.default.model("OrderItem", orderItemSchema);
exports.default = OrderItem;
