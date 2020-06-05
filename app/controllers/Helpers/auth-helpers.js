const jwt = require('jsonwebtoken');

const createToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '7d'
    });
}

const validToken = token => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (_, decoded) => decoded);

module.exports = {
    createToken,
    validToken
}