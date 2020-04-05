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
spotifyWebApi.redirectUrl = "http://localhost:3000/callback";


//handling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

// middle to check if auth
app.use((req, res, next) => {
    console.log("dentro middle");
    console.log("authCode :" + req.query.code);
    console.log("spotity.authCode : " + spotifyWebApi.authCode);
    console.log("spotify.refrshCode : " + spotifyWebApi.refreshToken);

    if (req.query.code  === undefined && spotifyWebApi.authCode === undefined) {
        console.log("prima call");
        console.log("redirect to "+ process.env.REDIRECT_URL);
        res.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + spotifyWebApi.clientId +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(spotifyWebApi.redirectUrl));
    } else if (req.query.code  !== undefined && spotifyWebApi.authCode === undefined || spotifyWebApi.isTokenExpried()) {
        console.log("no access token or token is exprired, rinnovo");
        spotifyWebApi.authCode = req.query.code || null;
        spotifyWebApi.updateToken()
            .then(() => {
                console.log("rinnovo successful - next");
                next();
            })
            .catch(() => {
                console.log("rinnovo NOT successful - redirect to login");
                res.send(res);
            });
    } else {
        console.log("neeeext");
        next();
    }
});

app.get('/callback', function (req, res) {
    console.log("CALLBACK to ME");
    res.redirect("/me");
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

