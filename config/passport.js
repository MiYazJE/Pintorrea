const passport       = require("passport");
const JwtStrategy    = require('passport-jwt').Strategy;
const LocalStrategy  = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

let { clientID, DOMAIN, clientSecret } = require('./config');

const authCtrl       = require('../app/controllers/localAuth.controller'); 
const googleAuthCtrl = require('../app/controllers/googleAuth.controller');

const OPTIONS = {
    LOCAL_STRATEGY_OPTIONS: {
        usernameField: "email",
        passwordField: "password"
    },
    JWT_STRATEGY_OPTIONS: {
        jwtFromRequest: (req) => req.cookies.jwt,
        secretOrKey: process.env.ACCESS_TOKEN_SECRET
    }
}

passport.serializeUser((user, done) => {
    done(null, user); 
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use('local-login', new LocalStrategy(OPTIONS.LOCAL_STRATEGY_OPTIONS, authCtrl.localStrategy));
passport.use(               new JwtStrategy(  OPTIONS.JWT_STRATEGY_OPTIONS,   authCtrl.jwtStrategy));    

passport.use(new GoogleStrategy({
    clientID, callbackURL: `${DOMAIN}/auth/google/callback`, clientSecret,
}, googleAuthCtrl.strategy));