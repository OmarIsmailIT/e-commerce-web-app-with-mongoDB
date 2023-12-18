const express = require('express');
import * as passport from 'passport';
const router = express.Router();
import * as wishlistController from '../controllers/wishlist.controller';

router.post('/:productId/add_to_wishlist',passport.authenticate('jwt', { session: false }),wishlistController.addProductToWishlist);
router.get('/',passport.authenticate('jwt', { session: false }),wishlistController.getWishlistProducts);

export default router;