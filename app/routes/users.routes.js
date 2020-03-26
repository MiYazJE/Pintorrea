const express  = require('express');
const router   = express.Router();
const users    = require('../controllers/user.controller');
const passport = require('passport'); 

const { createToken } = require('../controllers/Helpers/auth-helpers');

const optsCookie = {
    expires: new Date(Date.now() + 3600000),
	secure: false, // set to true if your using https
	httpOnly: true
}

router.post('/createUser', users.createUser);

router.post('/logIn', (req, res, next) => {
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(info);
        }
        req.logIn(user, error => {
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

router.get('/logOut', (req, res) => {
	res.clearCookie('jwt');
	return res.status(200).send({ logOut: true });
})

module.exports = router;