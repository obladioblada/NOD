const request = require('request');
import { configure, getLogger } from 'log4js';
const logger = getLogger("server");
logger.level = 'info';

export class SpotifyService {

    private _clientId: String;
    private _secretClient: String;
    redirectUrl: String;

    constructor(clientId: String, secretClientId: String ) {
        this._clientId = clientId;
        this._secretClient = secretClientId;
    }

    get clientId(): String {
        return this._clientId;
    }

    set clientId(value: String) {
        this._clientId = value;
    }

    get secretClient(): String {
        return this._secretClient;
    }

    set secretClient(value: String) {
        this._secretClient = value;
    }


    /**
     *  chiamata principale per login e update refresh token.
     *
     */
    updateToken(_refreshToken?: String) {
        let authOptions;
        authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + ( Buffer.from(this._clientId + ':' + this._secretClient).toString('base64'))},
            form: {
                grant_type: 'refresh_token',
                refresh_token: _refreshToken
            },
            json: true
        };
        return new Promise((resolve, reject) => {
                request.post(authOptions, (error, response, body) => {
                    logger.info("Post for token");
                    if (!error && response.statusCode === 200) {
                        resolve({
                            access_token: body.accessToken,
                        });
                    } else {
                        reject({
                        error: body.error
                    });
                }
            });
    
        });
      
    }

    authenticate(_authCode: String) {
        let authOptions;
        logger.info(_authCode);
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
                logger.info("I got a token, lets get my info");
                logger.info(body.access_token);
                if (!error && response.statusCode === 200) {
                        this.me(body.access_token)
                        .then((user: any) => {
                            resolve({
                                ...body,
                                id: user.id,
                                name: user.display_name,
                                pictureUrl: user.images[0].url,
                                status: response.statusCode
                            });
                        })                    
                } else {
                    reject({
                        status: response.statusCode,
                        access_token: body.accessToken,
                        refresh_token: body.refreshToken,
                        expiration_date: body.expirationDate,
                    })
                }
            });

        });
    }

    isTokenExpried(_expirationDate: number) {
        logger.info("is token expired: " + (new Date().getTime() > _expirationDate));
        return new Date().getTime() > _expirationDate
    };

    me(_accessToken:String) {
        logger.info(_accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
             if(body.status === 401 || !body || body === undefined){
                logger.error("error user")
                reject(body);
             }
                logger.info('user: ');
                logger.info(body);
                resolve(body)
            });

        });
    }

    CurrentlyPlaying(_accessToken:String) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/currently-playing',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                logger.info(body);
                logger.info(body.item.name);
                resolve({
                    "id": body.item.id,
                    "name": body.item.name,
                    "progress_ms": body.progress_ms,
                    "uri": body.item.uri
                })
            });
        });
    }

    play(_accessToken:String) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };

            // use the access token to access the Spotify Web API
            request(options,(error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });
        });
    }

    playSame(accessToken: String, uri: String, progressMs: String) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {'Authorization': 'Bearer ' + accessToken},
                json: true,
                body: {
                    uris: [uri],
                    position_ms: +progressMs,
                    play: true
                }
            };

            // use the access token to access the Spotify Web API
            request(options,(error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body)
            });
        });
    }

    player(_accessToken: String, id: String, play: boolean) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true,
                body:{
                    device_ids:[id],
                    play: play
                }
            };
            // use the access token to access the Spotify Web API
            request(options, function (error, response) {
                if (error) {
                    reject(error);
                }
                resolve({actionPerformed: true});
            });

        });
    }


    devices(_accessToken:String) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: {'Authorization': 'Bearer ' + _accessToken},
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

    activeDevices(_accessToken:String) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                let devices = body["devices"];
                for(let i = 0; i < devices.length; i++) {
                    let device = devices[i];
                    if(device.is_active) {
                        logger.info("active devices is " + device.id)
                        resolve(device.id);
                    }
                }
                // TODO
                resolve("")
            });

        });
    }

}



