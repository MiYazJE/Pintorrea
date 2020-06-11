const express      = require('express');
const path         = require('path');
const mongoose     = require('mongoose');
const passport     = require('passport');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const socketIO     = require('socket.io');

const app = express();
const dev = process.env.ENVIROMENT === 'DEVELOPMENT';

(async function initApp() {

    require('dotenv').config();
    app.use(require('morgan')('tiny'));

    initSession();
    initDataTransfer();
    await initDb();
    initPassport();
    initRoutes();

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => console.log('Listening at port ' + port));

    initSocketIO(server);
})();

function initSession() {
    app.use(session({ saveUninitialized: true, resave: false, secret: 'secret_key' }));
}

function initDataTransfer() {
    app.use(express.json({ limit: '3mb' }));
    app.use(express.urlencoded({ limit: '3mb', extended: false }));
    app.use(cookieParser());
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
    app.use('/',  require('./app/routes/api.routes'));
    app.use('/user', require('./app/routes/users.routes'));
    if (!dev) {
        app.use(express.static(path.join(__dirname, 'client/build')));
        app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client/build', 'index.html')));
    }
}

function initSocketIO(server) {
    const io = socketIO(server);
    const ioCtrl = require('./lib/socket-io.js')(io);
    app.locals.ioCtrl = ioCtrl;
}