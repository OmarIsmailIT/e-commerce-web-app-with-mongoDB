"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var passport = require("passport");
var router = express.Router();
var wishlistController = require("../controllers/wishlist.controller");
router.post('/:productId/add_to_wishlist', passport.authenticate('jwt', { session: false }), wishlistController.addProductToWishlist);
router.get('/', passport.authenticate('jwt', { session: false }), wishlistController.getWishlistProducts);
exports.default = router;
