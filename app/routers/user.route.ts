const express = require('express');
import * as passport from 'passport';
const router = express.Router();
import * as userPageController from "../controllers/user.controller";


router.get('/me',passport.authenticate('jwt', { session: false }),userPageController.getUserInfo);
router.put('/',passport.authenticate('jwt', { session: false }),userPageController.updateUserInfo);
router.post('/me/change_password',passport.authenticate('jwt', { session: false }),userPageController.updatePassword) 

export default router;