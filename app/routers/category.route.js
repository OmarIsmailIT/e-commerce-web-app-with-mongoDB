"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var categoryController = require("../controllers/category.controller");
router.get('/', categoryController.showCategories);
exports.default = router;
