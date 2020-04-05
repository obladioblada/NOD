'use strict';

const express = require('express');
const app = express();
const request = require('request');
const querystring = require('querystring');

const SpotifyWebApi = require('./SpotifyWebApi');
const spotifyWebApi = new SpotifyWebApi({
    secretClientId: process.env.SPOTIFY_CLIENT_SECRET,
    clientId: process.env.SPOTIFY_CLIENT_ID
});

const scopes = 'user-read-private user-read-email user-follow-read streaming app-remote-control user-modify-playback-state playlist-read-collaborative user-read-playback-state user-modify-playback-state';
spotifyWebApi.redirectUrl = "http://localhost:4200/callback";


//handling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.get('/updateToken', function (req, res) {
    console.log("no access token or token is exprired, rinnovo");
    spotifyWebApi.authCode = req.query.code || null;
    console.log("ricevuto code "+req.query.code)
    spotifyWebApi.updateToken()
        .then((val) => {
            console.log("rinnovo successful - next");
            console.log(val);
            res.send(val);
        })
        .catch(() => {
            console.log("rinnovo NOT successful - redirect to login");
            res.send({status: 500});
        });
});

app.get('/login', function (req, res) {
    console.log("CALLBACK to LOGIN");
    console.log("prima call");
    console.log("sending to "+ process.env.REDIRECT_URL);
        res.send({
            redirectUrl:'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + spotifyWebApi.clientId +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(spotifyWebApi.redirectUrl)
        });
});

app.get('/me', function (req, res) {
    spotifyWebApi.me()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/play', function (req, res) {
    spotifyWebApi.play()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player', function (req, res) {
    spotifyWebApi.player()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player/devices', function (req, res) {
    spotifyWebApi.devices()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

module.exports = app;

