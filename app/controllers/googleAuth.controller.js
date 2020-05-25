const passport        = require('passport');
const { createToken } = require('../controllers/Helpers/auth-helpers');
const userModel       = require('../models/user.model');

const { HOST_URL } = require('../../config/config');

const CALLBACK_REDIRECT = {
    successRedirect: process.env.ENVIROMENT === 'PRODUCTION' ? HOST_URL : 'http://localhost:3001/login',
    failureRedirect: `${HOST_URL}/auth/google/failure`
};

const optsCookie = {
    expires: new Date(Date.now() + 3600000),
	secure: false, // set to true if your using https
	httpOnly: true
}

const scope = [
    'email',
    'profile',
    'https://mail.google.com/'	
];

module.exports = {
    strategy,
    success,
    failure : (req, res) => res.sendStatus(403),
    callback: passport.authenticate('google', CALLBACK_REDIRECT),
    signIn  : passport.authenticate('google', { scope }),
}

function callback(req, res, next) {
    (req, res, next);
}

async function strategy(accessToken, refreshToken, profile, done) {
    try {
        const user = await userModel.findOne({ email: profile.email });

        if (user) {
            return done(null, { accessToken, refreshToken, id: user._id  });
        } 

        const { given_name, email, picture } = profile;
        const newUser = new userModel({
            name: given_name,
            email,
            picture
        });
        await newUser.save();

        done(null, { accessToken, refreshToken, id: newUser._id });
    }
    catch(error) {
        done(error, null)
    }
}

async function success(req, res) {
    const { user } = req;
    req.session.destroy();
    if (!user) return res.send({ auth: false });
    const token = createToken({ id: user.id });
    res.cookie('jwt', token, optsCookie);
    res.json({ auth: true });
}