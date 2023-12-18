"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
var categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image_url: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Add timestamps option
});
var Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
