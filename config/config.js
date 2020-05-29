const { 
    ACCESS_TOKEN_SECRET, ENVIROMENT, 
    clientID, callbackURL, clientSecret,
    DOMAIN_PRODUCTION
} = process.env;

const DB_PROPERTIES = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, };
let DB_URL, DOMAIN;

if (ENVIROMENT === 'DEVELOPMENT') {
    DB_URL = 'mongodb://localhost:27017/usuariosPintorrea';
    DOMAIN = '';
}
else if (ENVIROMENT === 'PRODUCTION') {
    DB_URL = `mongodb+srv://ruben:${process.env.mongoPassword}@mongo-fallero-s8xta.mongodb.net/test?retryWrites=true&w=majority`;
    DOMAIN = DOMAIN_PRODUCTION; 
}

module.exports = {
    ACCESS_TOKEN_SECRET,
    DB_URL,
    DB_PROPERTIES,
    DOMAIN,
    clientID,
    callbackURL,
    clientSecret
}