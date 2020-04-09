const request = require('request');
import { configure, getLogger } from 'log4js';
const logger = getLogger("server");
logger.level = 'info';

export class SpotifyService {

    private _clientId: string;
    private _secretClient: string;
    redirectUrl: string;

    constructor(clientId: string, secretClientId: string ) {
        this._clientId = clientId;
        this._secretClient = secretClientId;
    }

    get clientId(): string {
        return this._clientId;
    }

    set clientId(value: string) {
        this._clientId = value;
    }

    get secretClient(): string {
        return this._secretClient;
    }

    set secretClient(value: string) {
        this._secretClient = value;
    }


    /**
     *  chiamata principale per login e update refresh token.
     *
     */
    updateToken(_refreshToken?: string) {
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
                    logger.info("from Post for token");
                    logger.info(response.statusCode);
                    if (!error && response.statusCode === 200) {
                            this.me(body.access_token).then((meResponse) => {
                                logger.info(body)
                                if (body.access_token) {
                                    logger.info("setto access token col cazzo de valore "+ body.access_token);
                                    body.accessToken = body.access_token;
                                    logger.info("this.accessToken  " + body.accessToken);
                                };
                                resolve({
                                    access_token: body.accessToken,
                                });
                            })                    
                    } else {
                        reject({
                        error: body.error
                    })
                }
            });
    
        });
      
    }

    authenticate(_authCode: string) {
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
        }
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                logger.info("from Post for token");
                logger.info(response.statusCode);
                if (!error && response.statusCode === 200) {
                        this.me(body.access_token)
                        .then((val: any) => {
                            logger.info(body)
                            if (body.access_token) {
                                logger.info("setto access token col cazzo de valore "+ body.access_token);
                                body.accessToken = body.access_token;
                                logger.info("this.accessToken  " + body.accessToken);
                            };
                            resolve({
                                id: response.id,
                                status: response.statusCode,
                                access_token: body.accessToken,
                                refresh_token: body.refreshToken,
                                expiration_date: body.expirationDate
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
        console.log("is token expired: " + (new Date().getTime() > _expirationDate));
        return new Date().getTime() > _expirationDate
    };

    me(_accessToken:string) {
        console.log(_accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                console.log('body: ');
                console.log(body);
                resolve(body)
            }, (error) => {

                console.log(error)
                reject(error);
            });

        });
    }

    CurrentlyPlaying(_accessToken:string) {
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
                console.log(body.item.name);
                resolve({
                    "id": body.item.id,
                    "name": body.item.name,
                    "progress_ms": body.progress_ms,
                    "uri": body.uri
                })
            });
        });
    }

    play(_accessToken:string) {
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

    playSame(accessToken: string, uri: string, progressMs: string) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {'Authorization': 'Bearer ' + accessToken},
                json: true,
                body: {
                    uris: [uri],
                    position_ms: progressMs
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

    player(_accessToken: string) {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player',
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


    devices(_accessToken:string) {
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

    activeDevices(_accessToken:string) {
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
                        console.log("active devices is " + device.id)
                        resolve(device.id);
                    }
                }
                // TODO
                resolve("")
            });

        });
    }

}



