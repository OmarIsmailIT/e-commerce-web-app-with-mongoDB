"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var express = require('express');
var router = express.Router();
var addressController = require("../controllers/address.controller");
router.get('/', passport.authenticate('jwt', { session: false }), addressController.getUserAddressesByUserId);
router.post('/', passport.authenticate('jwt', { session: false }), addressController.createNewUserAddress);
exports.default = router;
