const express = require('express');

const router = express.Router();

import * as categoryController from "../controllers/category.controller"

router.get('/', categoryController.showCategories)

export default router;