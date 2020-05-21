const express   = require('express');
const router    = express.Router(); 

const usersCtrl      = require('../controllers/user.controller');
const googleAuthCtrl = require('../controllers/googleAuth.controller');

router.get('/',          usersCtrl.getUsers);
router.get('/deleteAll', usersCtrl.deleteAll);

router.get('/auth/google/signIn',   googleAuthCtrl.signIn);
router.get('/auth/google/callback', googleAuthCtrl.callback);
router.get('/auth/google/me',       googleAuthCtrl.me);
router.get('/auth/google/failure',  googleAuthCtrl.failure);

module.exports = router;