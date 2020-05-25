const { 
    ACCESS_TOKEN_SECRET, ENVIROMENT, 
    clientID, callbackURL, clientSecret 
} = process.env;

const HOST_URL = process.env.ENVIROMENT === 'PRODUCTION' ? 'https://pintorrea.herokuapp.com/' : `http://localhost:${process.env.PORT || 3000}`;
const DB_PROPERTIES = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
let DB_URL;

if (ENVIROMENT === 'DEVELOPMENT') {
    DB_URL = 'mongodb://localhost:27017/usuariosPintorrea';
}
else if (ENVIROMENT === 'PRODUCTION') {
    DB_URL = `mongodb+srv://ruben:${process.env.mongoPassword}@mongo-fallero-s8xta.mongodb.net/test?retryWrites=true&w=majority`;
}

module.exports = {
    HOST_URL,
    ACCESS_TOKEN_SECRET,
    DB_URL,
    DB_PROPERTIES,
    clientID,
    callbackURL,
    clientSecret
}