const jwt = require('jsonwebtoken');

const createToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 60 * 60 * 24
    });
}

const validToken = token => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (_, decoded) => decoded);

module.exports = {
    createToken,
    validToken
}