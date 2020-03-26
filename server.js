const express      = require('express');
const path         = require('path');
const mongoose     = require('mongoose');
const dbConfig     = require('./config/dbConfig.config');
const passport     = require('passport');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
require('dotenv').config();

const app = express();
require('./config/passport');

mongoose.Promise = global.Promise;

// serve static files 
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));

// Use this routes
app.use('/user', require('./app/routes/users.routes'));
app.use('/api', require('./app/routes/api.routes'));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongodb started...'))
    .catch(err => console.log(err))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at port ' + port));