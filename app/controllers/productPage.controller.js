"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductToCart = exports.productReviews = exports.productRelated = exports.productInfo = void 0;
var products_model_1 = require("../models/products.model");
var reviews_model_1 = require("../models/reviews.model");
var order_model_1 = require("../models/order.model");
var orderItem_model_1 = require("../models/orderItem.model");
// get the product information
var productInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, count, productInfo_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                productId = req.params.productId;
                console.log("Received product ID: ".concat(productId));
                return [4 /*yield*/, products_model_1.default.findById(productId)];
            case 1:
                product = _a.sent();
                return [4 /*yield*/, reviews_model_1.default.countDocuments({ product_id: productId })];
            case 2:
                count = _a.sent();
                if (product) {
                    productInfo_1 = __assign(__assign({}, product.toJSON()), { ratingCount: count });
                    res.status(200).json(productInfo_1);
                }
                else {
                    res.status(404).json({
                        message: "product not found",
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({ error: "Internal Server Error", details: error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.productInfo = productInfo;
var productRelated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var randomProducts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, products_model_1.default.aggregate([{ $sample: { size: 5 } }])];
            case 1:
                randomProducts = _a.sent();
                if (randomProducts.length > 0) {
                    res.status(200).json({ products: randomProducts });
                }
                else {
                    res.status(404).json({ message: "No products found" });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(500).json({ error: "Internal Server Error", details: error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.productRelated = productRelated;
// get all the reviews of an product
var productReviews = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, reviews, reviewsWithFullName, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productId = req.params.productId;
                return [4 /*yield*/, reviews_model_1.default.find({ product_Id: productId })
                        .populate({
                        path: "user_Id",
                        model: "User",
                        select: "first_name last_name",
                    })
                        .lean()];
            case 1:
                reviews = _a.sent();
                if (reviews.length > 0) {
                    reviewsWithFullName = reviews.map(function (review) {
                        var user = review.user_Id;
                        return __assign(__assign({}, review), { userFullName: "".concat(user.first_name, " ").concat(user.last_name) });
                    });
                    res.status(200).json({ reviews: reviewsWithFullName });
                }
                else {
                    res
                        .status(404)
                        .json({ message: "There is no reviews for this product ".concat(productId) });
                }
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(500).json({ error: "Internal Server Error", details: error_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.productReviews = productReviews;
// create an order if it doesn't exist and if it's status not in_cart
var addProductToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, orderItemQuantity, productId, product, cart, orderItem, orderItems, newTotalPrice, _i, orderItems_1, item, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                user = req.user;
                orderItemQuantity = req.body.orderItemQuantity;
                productId = req.params.productId;
                return [4 /*yield*/, products_model_1.default.findById(productId)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                }
                // Check if there is enough stock available
                if (product.stock_quantity < orderItemQuantity) {
                    return [2 /*return*/, res.status(400).json({ message: "Insufficient stock" })];
                }
                return [4 /*yield*/, order_model_1.default.findOne({ user_id: user._id, status: "in_cart" })];
            case 2:
                cart = _a.sent();
                if (!!cart) return [3 /*break*/, 4];
                return [4 /*yield*/, order_model_1.default.create({
                        user_id: user._id,
                        address_id: null,
                        status: "in_cart",
                        total_price: 0,
                        tax: 2,
                        order_items: [], // Initialize order_items array
                    })];
            case 3:
                // If no "in-cart" order exists, create a new one
                cart = _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, orderItem_model_1.default.findOne({
                    product_id: productId,
                    order_id: cart._id,
                })];
            case 5:
                orderItem = _a.sent();
                if (!orderItem) return [3 /*break*/, 7];
                // If the order item already exists, update its quantity and sub-total
                orderItem.quantity = orderItemQuantity;
                orderItem.sub_total =
                    (product.price - product.price * (product.discount / 100)) *
                        orderItem.quantity;
                return [4 /*yield*/, orderItem.save()];
            case 6:
                _a.sent();
                return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, orderItem_model_1.default.create({
                    quantity: orderItemQuantity,
                    order_id: cart._id,
                    product_id: productId,
                    sub_total: (product.price - product.price * (product.discount / 100)) *
                        orderItemQuantity,
                })];
            case 8:
                // If the order item doesn't exist, create a new one and save it to the database
                orderItem = _a.sent();
                // Add the order item's id to the order_items array in the cart
                cart.order_items.push(orderItem._id);
                return [4 /*yield*/, cart.save()];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                // Deduct the orderItemQuantity from the product's stock
                product.stock_quantity -= orderItemQuantity;
                return [4 /*yield*/, product.save()];
            case 11:
                _a.sent();
                return [4 /*yield*/, orderItem_model_1.default.find({ order_id: cart.id })];
            case 12:
                orderItems = _a.sent();
                newTotalPrice = 0;
                for (_i = 0, orderItems_1 = orderItems; _i < orderItems_1.length; _i++) {
                    item = orderItems_1[_i];
                    newTotalPrice += item.sub_total;
                }
                cart.total_price = newTotalPrice;
                return [4 /*yield*/, cart.save()];
            case 13:
                _a.sent();
                res.status(201).json({
                    message: "The product added as an order item to the cart",
                    cart: cart,
                });
                return [3 /*break*/, 15];
            case 14:
                error_4 = _a.sent();
                console.error(error_4);
                res.status(500).json({ error: "Internal Server Error", details: error_4 });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.addProductToCart = addProductToCart;
