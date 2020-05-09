const express      = require('express');
const path         = require('path');
const mongoose     = require('mongoose');
const dbConfig     = require('./config/dbConfig.config');
const passport     = require('passport');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const socketIO     = require('socket.io');

const app = express();

(async function initApp() {

    mongoose.Promise = global.Promise;

    initDataTransfer();
    await initDb();
    initPassport();
    initRoutes();
    
    app.use(express.static(path.join(__dirname, 'public')));

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => console.log('Listening at port ' + port));

    initSocketIO(server);
})();

function initDataTransfer() {
    require('dotenv').config();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));
}

async function initDb() {
    try {
        const DB_PROPERTIES = { useNewUrlParser: true, useUnifiedTopology: true };
        await mongoose.connect(dbConfig.url, DB_PROPERTIES);
        console.log('*** DB STARTED ***');
    }
    catch(error) {
        throw new Error(error)
    }
}

function initPassport() {
    require('./config/passport');
    app.use(passport.initialize());
    console.log('*** PASSPORT STARTED ***');
}

function initRoutes() {
    const HOME_PAGE = `__dirname${'/public/index.html'}`;

    app.use('/user', require('./app/routes/users.routes'));
    app.use('/api', require('./app/routes/api.routes'));
    app.get('*', (req, res) => res.sendFile(path.join(HOME_PAGE)));
}

function initSocketIO(server) {
    const io = socketIO(server);
    require('./config/socket-io.js')(io);
}