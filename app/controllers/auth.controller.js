const User = require('../models/user.model');

module.exports = {
    localStrategy,
    jwtStrategy
}

async function localStrategy(email, password, done) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { success: false, message: `El email ${email} no se encuentra registrado.` })
        }
        if (!await user.comparePassword(password, user.password)) {
            return done(null, false, { success: false, message: `Las contraseña no es correcta.` })
        }
        return done(null, { id: user._id }, { success: true, message: 'Has sido logeado correctamente.' })
    }
    catch(error) {
        return done(error, false, { success: false, message: 'Problemas internos.' })
    }
}

async function jwtStrategy(payload, done) {
    const user = await User.findById({ _id: payload.id });
    done(null, {
        id: user._id,
        name: user.name,
        email: user.email
    });
} 