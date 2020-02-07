require('dotenv').config();
const cors    = require('cors');
const path    = require('path');
const request = require('request');
const express = require('express');
const app     = express();
const helpers = require('./generate.js');

// what are these settings?
app.use(cors());
app.options('*', cors());

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

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ' + port));