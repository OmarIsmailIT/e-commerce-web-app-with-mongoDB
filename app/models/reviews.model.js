"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
var reviewSchema = new Schema({
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
}, {
    timestamps: true, // Add timestamps option
});
var Reviews = mongoose_1.default.model("Review", reviewSchema);
exports.default = Reviews;
