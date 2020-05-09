const passport      = require("passport");
const JwtStrategy   = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const { localStrategy, jwtStrategy } = require('../app/controllers/auth.controller'); 

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

passport.use('local-login', new LocalStrategy(OPTIONS.LOCAL_STRATEGY_OPTIONS, localStrategy));
passport.use(new JwtStrategy(OPTIONS.JWT_STRATEGY_OPTIONS, jwtStrategy));    