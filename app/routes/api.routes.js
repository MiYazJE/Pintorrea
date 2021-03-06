const express   = require('express');
const router    = express.Router(); 
const passport  = require('passport');

const usersCtrl      = require('../controllers/user.controller');
const googleAuthCtrl = require('../controllers/googleAuth.controller');
const dictionaryCtrl = require('../controllers/dictionaries.controller');
const rankingCtrl    = require('../controllers/ranking.controllers');

router.get('/auth/google/',         googleAuthCtrl.signIn);
router.get('/auth/google/user',     googleAuthCtrl.user);
router.get('/auth/google/callback', passport.authenticate('google'), googleAuthCtrl.callback);

// router.get(   '/dictionary/scrap',  dictionaryCtrl.scrapTargets);
// router.get(   '/dictionary/all',    dictionaryCtrl.get);
// router.get(   '/dictionary/topics', dictionaryCtrl.topics);
// router.delete('/dictionary/:topic',  dictionaryCtrl.dictionary);
router.get('/dictionary/randomWords',  dictionaryCtrl.randomWords);

router.post('/user/game/createRoom',         usersCtrl.createRoom);
router.get( '/user/game/room/valid/:idRoom', usersCtrl.isValidRoom);
router.post('/user/game/room/startGame',     usersCtrl.startPrivateGame);

router.post('/user/ranking/',        rankingCtrl.post);
router.get( '/user/ranking/',        rankingCtrl.get);
router.get( '/user/ranking/all',     rankingCtrl.getAll);
router.get( '/user/ranking/request', rankingCtrl.request);

module.exports = router;