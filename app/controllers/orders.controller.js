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
exports.getOrderDetails = exports.getUserOrders = exports.getInProgress = exports.deleteOrderItem = exports.changeOrderStatusAndPutAddress = void 0;
var jwt = require("jsonwebtoken");
var order_model_1 = require("../models/order.model");
var OrderItem = require("../models/orderItem.model");
var orderItem_model_1 = require("../models/orderItem.model");
var products_model_1 = require("../models/products.model");
var userAddress_model_1 = require("../models/userAddress.model");
var changeOrderStatusAndPutAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, orderId, _a, addressId, orderItems, order, _i, orderItems_1, incomingOrderItem, found, existingOrderItem, _b, _c, product, quantityDifference, updatedStockQuantity, updatedTotalPrice, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 14, , 15]);
                user = req.user;
                orderId = req.params.orderId;
                _a = req.body, addressId = _a.addressId, orderItems = _a.orderItems;
                return [4 /*yield*/, order_model_1.default.findOne({
                        user_id: user._id,
                        _id: orderId,
                    }).populate("order_items")];
            case 1:
                order = _d.sent();
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ message: "Order not found" })];
                }
                // Check if an address is provided
                if (addressId) {
                    // Update the order's address ID
                    order.address_id = addressId;
                    // Set the order status to "paid"
                    order.status = "paid";
                }
                if (!(orderItems && Array.isArray(orderItems))) return [3 /*break*/, 12];
                _i = 0, orderItems_1 = orderItems;
                _d.label = 2;
            case 2:
                if (!(_i < orderItems_1.length)) return [3 /*break*/, 11];
                incomingOrderItem = orderItems_1[_i];
                found = false;
                existingOrderItem = void 0;
                _b = 0, _c = order.order_items;
                _d.label = 3;
            case 3:
                if (!(_b < _c.length)) return [3 /*break*/, 9];
                existingOrderItem = _c[_b];
                if (!(existingOrderItem._id.toString() ===
                    incomingOrderItem._id.toString())) return [3 /*break*/, 8];
                found = true;
                if (!(incomingOrderItem.quantity !== existingOrderItem.quantity)) return [3 /*break*/, 7];
                return [4 /*yield*/, products_model_1.default.findById(existingOrderItem.product_id)];
            case 4:
                product = _d.sent();
                if (!product) {
                    console.log("Product not found for order item ID ".concat(existingOrderItem._id));
                    return [3 /*break*/, 8];
                }
                quantityDifference = incomingOrderItem.quantity - existingOrderItem.quantity;
                updatedStockQuantity = product.stock_quantity - quantityDifference;
                // Check if there is sufficient stock
                if (updatedStockQuantity < 0) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Insufficient stock for product ".concat(product._id),
                        })];
                }
                // Update product stock quantity
                product.stock_quantity = updatedStockQuantity;
                return [4 /*yield*/, product.save()];
            case 5:
                _d.sent();
                // Update order item quantity
                existingOrderItem.quantity = incomingOrderItem.quantity;
                // Calculate the new sub_total for the order item
                existingOrderItem.sub_total =
                    existingOrderItem.quantity * product.price;
                // Save the order item changes
                return [4 /*yield*/, existingOrderItem.save()];
            case 6:
                // Save the order item changes
                _d.sent();
                _d.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                _b++;
                return [3 /*break*/, 3];
            case 9:
                // Handle the case where the order item is not found
                if (!found) {
                    console.log("Order item with ID ".concat(incomingOrderItem._id, " not found in the order."));
                }
                _d.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 2];
            case 11:
                updatedTotalPrice = order.order_items.reduce(function (total, item) { return total + item.sub_total; }, 0);
                // Update order total_price
                order.total_price = updatedTotalPrice;
                _d.label = 12;
            case 12: 
            // Save the order changes
            return [4 /*yield*/, order.save()];
            case 13:
                // Save the order changes
                _d.sent();
                res.status(200).json({ message: "Order updated successfully", order: order });
                return [3 /*break*/, 15];
            case 14:
                error_1 = _d.sent();
                console.log(error_1);
                res.status(500).json({ error: "Internal Server Error", details: error_1 });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.changeOrderStatusAndPutAddress = changeOrderStatusAndPutAddress;
//////////////////////////////////////////////////////////////////////////////////
var deleteOrderItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderItemId, user, orderItem, associatedOrder, removedSubTotal, removedQuantity, associatedProduct, updatedStockQuantity, remainingOrderItems, updatedTotalPrice, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                orderItemId = req.params.orderItemId;
                user = req.user;
                return [4 /*yield*/, orderItem_model_1.default.findById(orderItemId)];
            case 1:
                orderItem = _a.sent();
                if (!orderItem || !orderItem.product_id) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Order item or associated product not found" })];
                }
                return [4 /*yield*/, order_model_1.default.findById(orderItem.order_id)];
            case 2:
                associatedOrder = _a.sent();
                console.log("associatedOrder:", associatedOrder);
                console.log("user._id:", user._id);
                // Check if the order item belongs to the authenticated user
                if (!associatedOrder || !associatedOrder.user_id.equals(user._id)) {
                    return [2 /*return*/, res.status(403).json({
                            message: "Unauthorized: Order item does not belong to the user",
                        })];
                }
                removedSubTotal = orderItem.sub_total;
                removedQuantity = orderItem.quantity;
                return [4 /*yield*/, products_model_1.default.findById(orderItem.product_id)];
            case 3:
                associatedProduct = _a.sent();
                if (!associatedProduct) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Associated product not found",
                        })];
                }
                updatedStockQuantity = associatedProduct.stock_quantity + removedQuantity;
                return [4 /*yield*/, associatedProduct.updateOne({
                        stock_quantity: updatedStockQuantity,
                    })];
            case 4:
                _a.sent();
                // Remove the order item from the order item table
                return [4 /*yield*/, orderItem.deleteOne()];
            case 5:
                // Remove the order item from the order item table
                _a.sent();
                return [4 /*yield*/, order_model_1.default.updateOne({ _id: associatedOrder._id }, { $pull: { order_items: orderItem._id } })];
            case 6:
                _a.sent();
                return [4 /*yield*/, orderItem_model_1.default.countDocuments({
                        order_id: associatedOrder._id,
                    })];
            case 7:
                remainingOrderItems = _a.sent();
                if (!(remainingOrderItems === 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, associatedOrder.deleteOne()];
            case 8:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Order and all order items removed successfully",
                    })];
            case 9:
                updatedTotalPrice = associatedOrder.total_price - removedSubTotal;
                return [4 /*yield*/, associatedOrder.updateOne({ total_price: updatedTotalPrice })];
            case 10:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Order item removed successfully" })];
            case 11:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(500).json({ error: "Internal Server Error", details: error_2 });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.deleteOrderItem = deleteOrderItem;
var getInProgress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decodedToken, order, items, itemsWithImage, totalDiscount, i, product, itemWithImage, totalItemDiscount, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                decodedToken = jwt.verify(token, "top-secret");
                return [4 /*yield*/, order_model_1.default.findOne({
                        user_id: decodedToken._id,
                        status: "in_cart",
                    })];
            case 1:
                order = _b.sent();
                if (!order) {
                    return [2 /*return*/, res.status(200).send({ message: "No orders found!", data: order })];
                }
                return [4 /*yield*/, orderItem_model_1.default.find({ order_id: order._id })];
            case 2:
                items = _b.sent();
                itemsWithImage = [];
                totalDiscount = 0;
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < items.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, products_model_1.default.findById(items[i].product_id)];
            case 4:
                product = _b.sent();
                itemWithImage = __assign(__assign({}, items[i].toJSON()), { image: product === null || product === void 0 ? void 0 : product.image_url, name: product === null || product === void 0 ? void 0 : product.name, sub_title: product === null || product === void 0 ? void 0 : product.short_description, product_price: product === null || product === void 0 ? void 0 : product.price });
                if ((product === null || product === void 0 ? void 0 : product.price) !== undefined && (product === null || product === void 0 ? void 0 : product.discount) !== undefined) {
                    totalItemDiscount = (items[i].quantity * product.price * product.discount) / 100;
                    totalDiscount = totalDiscount + totalItemDiscount;
                    itemsWithImage.push(itemWithImage);
                }
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, res.status(200).json({
                    data: itemsWithImage,
                    total_price: order.total_price,
                    total_discount: totalDiscount,
                    orderId: order.id,
                })];
            case 7:
                err_1 = _b.sent();
                console.log(err_1);
                res.status(500).send("Server Error");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getInProgress = getInProgress;
var getUserOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, orders, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, order_model_1.default.find({ user_id: user._id })];
            case 1:
                orders = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: orders })];
            case 2:
                _a = _b.sent();
                res.status(500).send("server error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserOrders = getUserOrders;
var getOrderDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, order, items, itemsWithImage, totalDiscount, i, product, totalItemDiscount, itemWithImage, address, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                id = req.params.id;
                return [4 /*yield*/, order_model_1.default.findById(id)];
            case 1:
                order = _a.sent();
                if (!order) {
                    return [2 /*return*/, res.status(200).json({ error: "Order not found" })];
                }
                return [4 /*yield*/, orderItem_model_1.default.find({ order_id: order._id }).populate("product_id")];
            case 2:
                items = _a.sent();
                itemsWithImage = [];
                totalDiscount = 0;
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < items.length)) return [3 /*break*/, 6];
                return [4 /*yield*/, products_model_1.default.findById(items[i].product_id)];
            case 4:
                product = _a.sent();
                if (!product) {
                    // Handle the case where the associated product is not found
                    console.error("Product not found for OrderItem with ID ".concat(items[i]._id));
                    return [3 /*break*/, 5]; // Skip to the next iteration of the loop
                }
                totalItemDiscount = (items[i].quantity * product.price * product.discount) / 100;
                totalDiscount = totalDiscount + totalItemDiscount;
                itemWithImage = __assign(__assign({}, items[i].toJSON()), { image: product.image_url, name: product.name, sub_title: product.short_description });
                itemsWithImage.push(itemWithImage);
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, userAddress_model_1.default.findOne({ _id: order.address_id })];
            case 7:
                address = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        data: itemsWithImage,
                        city: address === null || address === void 0 ? void 0 : address.city,
                        state: address === null || address === void 0 ? void 0 : address.state,
                        street: address === null || address === void 0 ? void 0 : address.street,
                        phone_number: address === null || address === void 0 ? void 0 : address.phone_number,
                        first_name: address === null || address === void 0 ? void 0 : address.first_name,
                        last_name: address === null || address === void 0 ? void 0 : address.last_name,
                        total_price: order.total_price,
                        total_discount: totalDiscount,
                    })];
            case 8:
                err_2 = _a.sent();
                console.error(err_2);
                return [2 /*return*/, res.status(500).json({ error: "Internal Server Error" })];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getOrderDetails = getOrderDetails;
