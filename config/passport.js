const passport      = require("passport");
const JwtStrategy   = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user.model');

passport.use('local-login', new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { success: false, message: `El email ${email} no se encuentra registrado.` })
        }
        if (!await user.comparePassword(password, user.password)) {
            return done(null, false, { success: false, message: `Las contraseña no es correcta.` })
        }
        done(null, { id: user._id }, { success: true, message: 'Has sido logeado correctamente.' })
    }
    catch(error) {
        done(error, false, { success: false, message: 'Problemas internos.' })
    }
}));

const opts = {
    jwtFromRequest: (req) => req.cookies.jwt,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}

passport.use(new JwtStrategy(opts, 
    async (payload, done) => {
        const user = await User.findById({ _id: payload.id });
        done(null, {
            id: user._id,
            name: user.name,
            email: user.email
        });
    } 
));    