"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request');
const Logger_1 = require("./logging/Logger");
class SpotifyService {
    constructor(clientId, secretClientId) {
        this._clientId = clientId;
        this._secretClient = secretClientId;
    }
    get clientId() {
        return this._clientId;
    }
    set clientId(value) {
        this._clientId = value;
    }
    get secretClient() {
        return this._secretClient;
    }
    set secretClient(value) {
        this._secretClient = value;
    }
    /**
     *  chiamata principale per login e update refresh token.
     *
     */
    updateToken(_refreshToken) {
        let authOptions;
        authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (Buffer.from(this._clientId + ':' + this._secretClient).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: _refreshToken
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                Logger_1.logger.info("Post for token");
                if (!error && response.statusCode === 200) {
                    resolve({
                        access_token: body.accessToken,
                    });
                }
                else {
                    reject({
                        error: body.error
                    });
                }
            });
        });
    }
    authenticate(_authCode) {
        let authOptions;
        Logger_1.logger.info(_authCode);
        authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: _authCode,
                redirect_uri: this.redirectUrl,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(this._clientId + ':' + this._secretClient).toString('base64'))
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                Logger_1.logger.info("I got a token, lets get my info");
                Logger_1.logger.info(body.access_token);
                if (!error && response.statusCode === 200) {
                    this.me(body.access_token)
                        .then((user) => {
                        resolve(Object.assign(Object.assign({}, body), { id: user.id, name: user.display_name, pictureUrl: user.images[0].url, status: response.statusCode }));
                    });
                }
                else {
                    reject({
                        status: response.statusCode,
                        access_token: body.accessToken,
                        refresh_token: body.refreshToken,
                        expiration_date: body.expirationDate,
                    });
                }
            });
        });
    }
    isTokenExpried(_expirationDate) {
        Logger_1.logger.info("is token expired: " + (new Date().getTime() > _expirationDate));
        return new Date().getTime() > _expirationDate;
    }
    ;
    me(_accessToken) {
        Logger_1.logger.info(_accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (body.status === 401 || !body) {
                    Logger_1.logger.error("error user");
                    reject(body);
                }
                Logger_1.logger.info('user: ');
                Logger_1.logger.info(body);
                resolve(body);
            });
        });
    }
    CurrentlyPlaying(_accessToken) {
        Logger_1.logger.info(_accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/currently-playing',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                Logger_1.logger.info(error);
                Logger_1.logger.info(response.statusCode);
                Logger_1.logger.info(response.body);
                Logger_1.logger.info(body);
                resolve(body && {
                    "id": body.item.id,
                    "name": body.item.name,
                    "progress_ms": body.progress_ms,
                    "uri": body.item.uri
                });
            });
        });
    }
    syncUsers(userToJoin, joiner) {
        return exports.spotifyService.CurrentlyPlaying(userToJoin.accessToken)
            .then((song) => {
            Logger_1.logger.info("playing song: " + song.name);
            const uriSong = song.uri;
            const progressMs = song.progress_ms;
            return exports.spotifyService.playSame(joiner.accessToken, uriSong, progressMs)
                .then((response) => {
                Logger_1.logger.info(response);
                Logger_1.logger.info(joiner.name + " joined!");
                return { response, song };
            })
                .catch((error) => {
                Logger_1.logger.info(joiner.name + " failed to join!!");
                Logger_1.logger.error(error);
                return error;
            });
        });
    }
    play(_accessToken) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true
            };
            // use the access token to access the Spotify Web API
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }
    playSame(accessToken, uri, progressMs) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: { 'Authorization': 'Bearer ' + accessToken },
                json: true,
                body: {
                    uris: [uri],
                    position_ms: +progressMs,
                    play: true
                }
            };
            // use the access token to access the Spotify Web API
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }
    player(_accessToken, id, play) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true,
                body: {
                    device_ids: [id],
                    play: play
                }
            };
            // use the access token to access the Spotify Web API
            request(options, function (error, response) {
                if (error) {
                    reject(error);
                }
                resolve({ actionPerformed: true });
            });
        });
    }
    devices(_accessToken) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }
    activeDevices(_accessToken) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: { 'Authorization': 'Bearer ' + _accessToken },
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                let devices = body["devices"];
                for (let i = 0; i < devices.length; i++) {
                    let device = devices[i];
                    if (device.is_active) {
                        Logger_1.logger.info("active devices is " + device.id);
                        resolve(device.id);
                    }
                }
                // TODO
                resolve("");
            });
        });
    }
}
exports.SpotifyService = SpotifyService;
exports.spotifyService = new SpotifyService("9dc9612b49ac4e9bba44e1ecc936b188", "ff2c9b01d6c941819d4ec3a1af126e82");
//# sourceMappingURL=spotifyService.js.map