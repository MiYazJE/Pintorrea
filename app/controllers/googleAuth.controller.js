const passport = require('passport');

const CALLBACK_REDIRECT = {
    successRedirect: 'http://localhost:3001/login',
    failureRedirect: 'http://localhost:3000/auth/google/failure'
};

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

function strategy(accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, { accessToken, refreshToken, profile });
}

function me(req, res) {
    console.log('test')
    console.log(req.user);
    res.json({ user: req.user });
}