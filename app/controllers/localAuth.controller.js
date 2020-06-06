const User = require('../models/user.model');

const { createToken } = require('../controllers/Helpers/auth-helpers');

const optsCookie = {
    expires: new Date(Date.now() + 3600000 * 24 * 7),
	secure: process.env.ENVIROMENT === 'PRODUCTION',
	httpOnly: true
}

module.exports = {
    localStrategy,
    jwtStrategy,
    whoAmI,
    logIn,
    removeCookie
}

async function localStrategy(email, password, done) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            done(null, false, { success: false, message: `El email ${email} no se encuentra registrado.` })
        }
        if (!await user.comparePassword(password, user.password)) {
            done(null, false, { success: false, message: `Las contraseña no es correcta.` })
        }
        done(null, { id: user._id }, { success: true, message: 'Has sido logeado correctamente.' })
    }
    catch(error) {
        done(error, false, { success: false, message: 'Problemas internos.' })
    }
}

async function jwtStrategy(payload, done) {
    const { _id, name, email, picture, avatar, sex } = await User.findById({ _id: payload.id });
    done(null, { id: _id, name, email, picture, avatar, sex });
} 

function whoAmI(req, res) {
    const { user } = req;
    if (!user) {
        return res.status(401).send({ auth: false, message: 'No valid token' });
    }
    res.status(200).send({
        auth: true,
        user
    });
}

function logIn(req, res) {
    return (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(info);
        }
        req.logIn(user, error => {
            const token = createToken({ id: user.id });
            res.cookie('jwt', token, optsCookie);
            res.send(info);
        });
    }
}

function removeCookie(req, res) {
    req.session.destroy();
    res.clearCookie('jwt');
	res.status(200).send({ logOut: true });
}