const express = require('express');

const router = express.Router();
import* as brandController from '../controllers/brand.controller'

router.get('/',brandController.showBrands);

export default router;