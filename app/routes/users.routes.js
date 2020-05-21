const express   = require('express');
const router    = express.Router();
const usersCtrl = require('../controllers/user.controller');
const passport  = require('passport'); 

const { createToken } = require('../controllers/Helpers/auth-helpers');

const optsCookie = {
    expires: new Date(Date.now() + 3600000),
	secure: false, // set to true if your using https
	httpOnly: true
}

router.post('/createUser', usersCtrl.createUser);

router.post('/logIn', (req, res, next) => {
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(info);
        }
        req.logIn(user, error => {
			req.session.destroy();
			console.log(user);
            const token = createToken({ id: user.id });
            res.cookie('jwt', token, optsCookie);
            res.send(info);
        });
    })(req, res, next);
});

router.get('/whoAmI', (req, res) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(401).send({ auth: false, message: 'No valid token' });
		}
		res.status(200).send({
			auth: true,
			user
		})
	})(req, res)
});

router.get('/exists/:userName', usersCtrl.exists);

router.get('/removeCookie', (req, res) => {
	res.clearCookie('jwt');
	return res.status(200).send({ logOut: true });
});

router.get('/imLogged', (req, res, next) => {
	passport.authenticate('jwt', (err, user, info) => {
		res.send({ auth: Boolean(user) });
	})(req, res, next);
});

router.post('/uploadPicture', usersCtrl.uploadPicture);

module.exports = router;