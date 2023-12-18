"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var User = require("../models/user.model");
var router = express.Router();
router.post('/', function (req, res, next) {
    passport.authenticate('local-signup', { session: false }, function (err, user, info) {
        if (err) {
            return res.status(401).json({ error: 'Authentication error: ' + err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'the email is already taken' });
        }
        // Authentication successful, generate a JWT token
        var token = jwt.sign({ _id: user._id }, 'top-secret', { expiresIn: '1h' });
        return res.json({ token: "Bearer " + token });
    })(req, res, next);
});
exports.default = router;
