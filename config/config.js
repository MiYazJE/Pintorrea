const { 
    ACCESS_TOKEN_SECRET, ENVIROMENT, 
    clientID, callbackURL, clientSecret 
} = process.env;

const DB_PROPERTIES = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
let DB_URL;

if (ENVIROMENT === 'DEVELOPMENT') {
    DB_URL = 'mongodb://localhost:27017/usuariosPintorrea';
}
else if (ENVIROMENT === 'PRODUCTION') {

}

module.exports = {
    ACCESS_TOKEN_SECRET,    
    ACCESS_TOKEN_SECRET,
    DB_URL,
    DB_PROPERTIES,
    clientID,
    callbackURL,
    clientSecret
}