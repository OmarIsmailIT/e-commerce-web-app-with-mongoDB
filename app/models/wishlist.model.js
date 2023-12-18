"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var wishlistSchema = new mongoose_1.Schema({
    product_id: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
var Wishlist = mongoose_1.default.model("Wishlist", wishlistSchema);
exports.default = Wishlist;
