"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
var addressSchema = new Schema({
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
}, {
    timestamps: true, // Add timestamps option
});
var UserAddress = mongoose_1.default.model("User-address", addressSchema);
exports.default = UserAddress;
