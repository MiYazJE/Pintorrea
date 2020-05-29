const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');

const usersCtrl      = require('../controllers/user.controller');
const googleAuthCtrl = require('../controllers/googleAuth.controller');
const dictionaryCtrl = require('../controllers/dictionaries.controller');

// router.get('/getUsers',  usersCtrl.getUsers);
// router.get('/deleteAll', usersCtrl.deleteAll);

router.get('/auth/google/',         googleAuthCtrl.signIn);
router.get('/auth/google/user',     googleAuthCtrl.user);
router.get('/auth/google/callback', passport.authenticate('google'), googleAuthCtrl.callback);

router.get('/scrap/dictionary/spanish', dictionaryCtrl.scrapSpanishBasic);

module.exports = router;