'use strict';

const request = require('request');


module.exports = class SpotifyWebApi {


    constructor(data) {
        this._clientId = data.clientId;
        this._secretClient = data.secretClientId;
    }

    set clientId(clientId) {
        this._clientId = clientId
    }

    get clientId() {
        return this._clientId;
    }

    set secretClient(secretClient) {
        this._clientId = secretClient;
    }

    get secretClient() {
        return this._secretClient;
    }

    set accessToken(accessToken) {
        this._accessToken = accessToken;
    }

    get accessToken() {
        return this._accessToken;
    }

    set refreshToken(refreshToken) {
        this._refreshToken = refreshToken;
    }

    get refreshToken() {
        return this._refreshToken;
    }

    set redirectUrl(redirectUrl) {
        this._redirectUrl = redirectUrl;
    }

    get redirectUrl() {
        return this._redirectUrl;
    }

    set expirationTime(expirationTime) {
        this._expirationTime = new Date().getTime() + expirationTime;
    }

    get expirationTime() {
        return this._expirationTime
    }

    set authCode(authCode) {
        this._authCode = authCode;
    }

    get authCode() {
        return this._authCode
    }


    /**
     *  chiamata principale per login e update refresh token.
     *
     */
    updateToken() {
        let authOptions;
        if ((!this.accessToken && !this.refreshToken && !this.expirationTime)) {
            console.log("setting login options");
            authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: this.authCode,
                    redirect_uri: this.redirectUrl,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer.from(this.clientId + ':' + this.secretClient).toString('base64'))
                },
                json: true
            };
        } else if ((this.refreshToken) && (this.isTokenExpried())) {
            authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {'Authorization': 'Basic ' + (new Buffer.from(this.clientId + ':' + this.secretClient).toString('base64'))},
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken
                },
                json: true
            };
        }
        return this.authenticate(authOptions);
    }

    authenticate(authOptions) {
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                console.log("from Post for token");
                console.log(response.statusCode);
                if (!error && response.statusCode === 200) {
                    console.log(body)
                    if (body.access_token) {
                        console.log("setto access token col cazzo de valore "+body.access_token);
                        this.accessToken = body.access_token;
                        console.log("this.accessToken  " + this.accessToken);
                    }
                    console.log("refresh token :  " + body.refresh_token);

                    if (body.refresh_token !== undefined) {
                        this.refreshToken = body.refresh_token;
                        console.log("settaggio refresh : " + this.refreshToken)
                    }
                    if (body.expires_in !== undefined) {
                        console.log(body.expires_in);
                        this.expirationTime = body.expires_in;
                    }
                    resolve({
                        access_token: this.accessToken,
                        refresh_token: this.refreshToken,
                        expiration_time: this.expirationTime
                    });
                } else {
                    reject({
                        access_token: this.accessToken,
                        refresh_token: this.refreshToken,
                        expiration_time: this.expirationTime
                    })
                }
            });

        });
    }

    authorize(scopes) {
        return new Promise((resolve, reject) => {
            request.get('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + this.clientId +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(this.redirectUrl));
        });
    }

    isTokenExpried() {
        console.log("is token expired: " + new Date().getTime() > this.expirationTime);
        return new Date().getTime() > this.expirationTime
    };

    me() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + this.accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });

        });
    }

    play() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                headers: {'Authorization': 'Bearer ' + this.accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.put(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });

        });
    }


    player() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player',
                headers: {'Authorization': 'Bearer ' + this.accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });

        });
    }


    devices() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: {'Authorization': 'Bearer ' + this.accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });

        });
    }


};



