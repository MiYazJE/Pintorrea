const express       = require('express');
const router        = express.Router();
const usersCtrl     = require('../controllers/user.controller');
const localAuthCtrl = require('../controllers/localAuth.controller');
const passport      = require('passport'); 

router.post('/logIn', (req, res, next) => 
passport.authenticate(
	'local-login', 
	{ session: false }, 
	localAuthCtrl.logIn(req, res)
)(req, res, next));
router.get('/whoAmI',       passport.authenticate('jwt', { session: false }), localAuthCtrl.whoAmI);
router.get('/removeCookie', localAuthCtrl.removeCookie);
	
router.post( '/createUser',            usersCtrl.create);
router.get(  '/exists/name/:userName', usersCtrl.userNameExists);
router.get(  '/exists/email/:email',   usersCtrl.emailExists);
router.post( '/uploadPicture',         usersCtrl.uploadPicture);
router.get(  '/profile/:id',           usersCtrl.getProfile);
router.post( '/profile/avatar',        usersCtrl.changeAvatar);
router.post( '/profile/avatar/image',  usersCtrl.changePictureFromAvatar);

module.exports = router;