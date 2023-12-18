"use strict";
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
exports.updatePassword = exports.updateUserInfo = exports.getUserInfo = void 0;
var bcrypt_1 = require("bcrypt");
var user_model_1 = require("../models/user.model");
var getUserInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userInfo, userObject, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, user_model_1.default.findById(user._id).exec()];
            case 1:
                userInfo = _a.sent();
                if (!userInfo) {
                    return [2 /*return*/, res.status(200).json({ message: "User not found" })];
                }
                userObject = userInfo.toObject();
                return [2 /*return*/, res.status(200).json({
                        _id: userObject._id,
                        first_name: userObject.first_name,
                        last_name: userObject.last_name,
                        email: userObject.email,
                        phone_number: userObject.phone_number,
                    })];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).json({ error: "Internal Server Error", details: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserInfo = getUserInfo;
var updateUserInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, first_name, last_name, email, phone_number, updatedUserInfo, hasUpdates, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                user = req.user;
                _a = req.body, first_name = _a.first_name, last_name = _a.last_name, email = _a.email, phone_number = _a.phone_number;
                return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(user._id, {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        phone_number: phone_number,
                    }, {
                        new: true,
                        projection: {
                            _id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            phone_number: true,
                        },
                    }).exec()];
            case 1:
                updatedUserInfo = _b.sent();
                if (!updatedUserInfo) {
                    return [2 /*return*/, res.status(200).json({ message: "User not found" })];
                }
                console.log("Before update:", updatedUserInfo);
                console.log("After update:", req.body);
                hasUpdates = JSON.stringify(updatedUserInfo) !== JSON.stringify(req.body);
                if (hasUpdates) {
                    return [2 /*return*/, res.status(200).json({
                            message: "User information updated successfully",
                            updatedUserInfo: updatedUserInfo,
                        })];
                }
                else {
                    return [2 /*return*/, res
                            .status(200)
                            .json({ message: "No updates were made to user information" })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(500).json({ error: "Internal Server Error", details: error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserInfo = updateUserInfo;
var updatePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, currentPassword, newPassword, userInfo, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                user = req.user;
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, user_model_1.default.findById(user._id)];
            case 1:
                userInfo = _b.sent();
                if (!userInfo) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                if (!(0, bcrypt_1.compareSync)(currentPassword, userInfo.password)) return [3 /*break*/, 3];
                // Update the password and save the user document
                userInfo.password = (0, bcrypt_1.hashSync)(newPassword, 10);
                return [4 /*yield*/, userInfo.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Password changed successfully" })];
            case 3: return [2 /*return*/, res.status(403).json({ message: "Current password is incorrect" })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error(error_3);
                res.status(500).json({ message: "Internal server error", details: error_3 });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updatePassword = updatePassword;
