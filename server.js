const express      = require('express');
const path         = require('path');
const mongoose     = require('mongoose');
const passport     = require('passport');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const socketIO     = require('socket.io');

const app = express();

(async function initApp() {

    initSession();
    initDataTransfer();
    await initDb();
    initPassport();
    initRoutes();
    
    app.use(express.static(path.join(__dirname, 'public')));

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => console.log('Listening at port ' + port));

    initSocketIO(server);
})();

function initSession() {
    app.use(session({ saveUninitialized: true, resave: false, secret: 'secret_key' }));
}

function initDataTransfer() {
    require('dotenv').config();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors({ credentials: true, origin: 'http://localhost:3001', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
}

async function initDb() {
    try {
        const { DB_URL, DB_PROPERTIES } = require('./config/config');
        await mongoose.connect(DB_URL, DB_PROPERTIES);
        console.log('*** DB STARTED ***');
    }
    catch(error) {
        throw new Error(error);
    }
}

function initPassport() {
    require('./config/passport');
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('*** PASSPORT STARTED ***');
}

function initRoutes() {
    const HOME_PAGE = `http://localhost:3001`;
    app.use('/',     require('./app/routes/api.routes'));
    app.use('/user', require('./app/routes/users.routes'));
    app.get('*', (req, res) => res.redirect(HOME_PAGE));
}

function initSocketIO(server) {
    const io = socketIO(server);
    require('./config/socket-io.js')(io);
}