"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wishlist",
        default: null,
    },
    orders_ids: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    reviews_ids: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    userAddress_ids: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User-address",
        },
    ],
}, {
    timestamps: true, // Add timestamps option
});
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
