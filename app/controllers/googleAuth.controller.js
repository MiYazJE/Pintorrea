const passport        = require('passport');
const { createToken } = require('../controllers/Helpers/auth-helpers');
const userModel       = require('../models/user.model');

const optsCookie = {
    expires: new Date(Date.now() + 3600000),
	secure: false, 
	httpOnly: true
}

const scope = [
    'email',
    'profile',
    'https://mail.google.com/'	
];

const REDIRECT_CALLBACK = process.env.ENVIROMENT === 'DEVELOPMENT' ? 'http://localhost:3000/login' : '/login';

module.exports = {
    strategy,
    user,
    signIn  : passport.authenticate('google', { scope }),
    callback: (req, res) => res.redirect(REDIRECT_CALLBACK)
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

async function user(req, res) {
    const { user } = req;
    req.session.destroy();
    if (!user) return res.send({ auth: false });
    const token = createToken({ id: user.id });
    res.cookie('jwt', token, optsCookie);
    res.json({ auth: true });
}