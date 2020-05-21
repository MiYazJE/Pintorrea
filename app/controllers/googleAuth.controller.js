const passport        = require('passport');
const { createToken } = require('../controllers/Helpers/auth-helpers');
const userModel       = require('../models/user.model');

const CALLBACK_REDIRECT = {
    successRedirect: 'http://localhost:3001/login',
    failureRedirect: 'http://localhost:3000/auth/google/failure'
};

const optsCookie = {
    expires: new Date(Date.now() + 3600000),
	secure: false, // set to true if your using https
	httpOnly: true
}

const scope = [
    'email',
    'profile',
];

module.exports = {
    strategy,
    callback,
    me,
    failure: (req, res) => res.sendStatus(403),
    signIn : passport.authenticate('google', { scope }),
}

function callback(req, res, next) {
    passport.authenticate('google', CALLBACK_REDIRECT)(req, res, next);
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

async function me(req, res) {
    const { user } = req;
    console.log('me', user)
    if (!user) return res.send({ auth: false });
    const token = createToken({ id: user.id });
    res.cookie('jwt', token, optsCookie);
    res.json({ auth: true });
}