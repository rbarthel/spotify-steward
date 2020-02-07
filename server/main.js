require('dotenv').config();

const cors     = require('cors');
const path     = require('path');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const request  = require('request');
const express  = require('express');
const session  = require('express-session')

const app      = express();

const database = require('./database.js');
const helpers  = require('./generate.js');




passport.use(new Strategy(function(username, password, cb) {
    database.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    database.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});



app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })); // what are these params?
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.options('*', cors()); // what does this do?


// serve up client files
app.use(express.static(path.join(__dirname + '/../client/dist')));

// create playlist and add to users account
// break up in to smaller functions later (generate + download a playlist?)
app.get('/api/generate/:query/:token', (req, res) => {
    generate.generatePlaylist(req.params).then((playlist) => {
        res.json(playlist);
    }).catch(error => {
        res.sendStatus(400);
    });
});

// app.get('/api/account', (req, res) => {
//     get account details to populate account page
// });

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port));