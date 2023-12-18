const passport = require("passport")

const express = require('express');

const router = express.Router();
import* as addressController from '../controllers/address.controller'

router.get('/',passport.authenticate('jwt', { session: false }),addressController.getUserAddressesByUserId);
router.post('/',passport.authenticate('jwt', { session: false }), addressController.createNewUserAddress)
export default router;