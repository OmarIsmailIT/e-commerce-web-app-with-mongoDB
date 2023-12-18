const express = require('express');
import * as passport from 'passport';
const router = express.Router();
import * as productPageController from "../controllers/productPage.controller";
import * as productsController from "../controllers/products.controller"

router.get('/',productsController.list);
router.get('/:productId',productPageController.productInfo);
router.get('/:productId/related',productPageController.productRelated);
router.get('/:productId/reviews',productPageController.productReviews);
router.post('/:productId/add_to_cart',passport.authenticate('jwt', { session: false }),productPageController.addProductToCart);


export default router;