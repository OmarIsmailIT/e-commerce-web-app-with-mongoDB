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
var passport_jwt_1 = require("passport-jwt");
var user_model_1 = require("../models/user.model");
var passport = require("passport");
var bcrypt = require("bcrypt");
var passport_local_1 = require("passport-local");
var jwt_config_1 = require("./jwt.config");
var opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_config_1.jwtConfig.secret,
};
passport.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.default.findOne({ _id: jwt_payload._id })];
            case 1:
                user = _a.sent();
                if (user) {
                    return [2 /*return*/, done(null, user)];
                }
                else {
                    return [2 /*return*/, done(null, false)];
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, done(err_1, false)];
            case 3: return [2 /*return*/];
        }
    });
}); }));
passport.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, isValidPassword, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!email || !password) {
                    return [2 /*return*/, done(null, false, {
                            message: "Email and password are required in the request body.",
                        })];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, done(null, false, { message: "Incorrect username." })];
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 2:
                isValidPassword = _a.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, done(null, false, { message: "Incorrect password." })];
                }
                return [2 /*return*/, done(null, user)];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, done(error_1)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
passport.use("local-signup", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, function (req, email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, _a, first_name, last_name, phone_number, newUser, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                if (!req.body.email || !req.body.password) {
                    // Check if email and password are present in the request body
                    return [2 /*return*/, done(null, false, {
                            message: "Email and password are required in the request body.",
                        })];
                }
                // Check if email and password are not provided in the params
                if (req.params.email || req.params.password) {
                    return [2 /*return*/, done(null, false, {
                            message: "Credentials should not be provided in the params.",
                        })];
                }
                return [4 /*yield*/, user_model_1.default.findOne({
                        email: { $regex: new RegExp(email, "i") },
                    })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, done(null, false, { message: "That email is already taken." })];
                }
                _a = req.body, first_name = _a.first_name, last_name = _a.last_name, phone_number = _a.phone_number;
                newUser = new user_model_1.default();
                newUser.email = email;
                _b = newUser;
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                _b.password = _c.sent(); // Hash the password
                newUser.first_name = first_name;
                newUser.last_name = last_name;
                newUser.phone_number = phone_number;
                return [4 /*yield*/, newUser.save()];
            case 3:
                _c.sent();
                return [2 /*return*/, done(null, newUser)];
            case 4:
                error_2 = _c.sent();
                return [2 /*return*/, done(error_2)];
            case 5: return [2 /*return*/];
        }
    });
}); }));
exports.default = passport;
