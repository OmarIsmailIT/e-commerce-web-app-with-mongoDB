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
exports.createNewUserAddress = exports.getUserAddressesByUserId = void 0;
var jwt = require("jsonwebtoken");
var userAddress_model_1 = require("../models/userAddress.model");
var getUserAddressesByUserId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decodedToken, addresses, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                decodedToken = jwt.verify(token, "top-secret");
                return [4 /*yield*/, userAddress_model_1.default.find({ user_id: decodedToken._id })];
            case 1:
                addresses = _b.sent();
                return [2 /*return*/, res.status(201).json(addresses)];
            case 2:
                err_1 = _b.sent();
                console.log("Error in getting User Address by Id", err_1);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "Internal Server Error", details: err_1 })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserAddressesByUserId = getUserAddressesByUserId;
var createNewUserAddress = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decodedToken, existingAddress, newAddress, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                decodedToken = jwt.verify(token, "top-secret");
                return [4 /*yield*/, userAddress_model_1.default.findOne({
                        user_id: decodedToken._id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        pin_code: req.body.pin_code,
                    })];
            case 1:
                existingAddress = _b.sent();
                if (!!existingAddress) return [3 /*break*/, 3];
                return [4 /*yield*/, userAddress_model_1.default.create({
                        user_id: decodedToken._id,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone_number: req.body.phone_number,
                        email: req.body.email,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        pin_code: req.body.pin_code,
                    })];
            case 2:
                newAddress = _b.sent();
                return [2 /*return*/, res.status(201).json(newAddress)];
            case 3: return [2 /*return*/, res
                    .status(409)
                    .send("This address is already associated with another account")];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.log("Error in creating a new User Address", error_1);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "Internal Server Error", details: error_1 })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createNewUserAddress = createNewUserAddress;
// Update an existing address
// export const updateExistingUserAddress = async (req: Request, res: Response) => {
//   try {
//     let updatedAddress = await userAddress.update(req.body, { where: { id: req.params.addressId }});
//     return res.status(201).json(updatedAddress[0]);
//   } catch (err) {
//     console.log('Error in updating User Address', err);
//     return res.status(500).send();
//     }
//     };
// // Delete an existing address
// export const deleteExistingUserAddress = async (req: Request, res: Response) => {
//     try {
//     let deletedAddress = await userAddress.destroy({ where: { id: req.params.addressId }});
//     return res.status(201).json(deletedAddress);
// } catch (err) {
//     console.log('Error in deleting User Address', err);
//     return res.status(500).send();
//     }
//     };
