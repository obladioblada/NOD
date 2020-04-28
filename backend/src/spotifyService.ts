const request = require('request');
import {logger} from "./logging/Logger";
import { User } from "./models/User";

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

    me(_accessToken:string) {
        logger.info(_accessToken);
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + _accessToken},
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
             if(body.status === 401 || !body){
                logger.error("error user");
                reject(body);
             }
                logger.info('user: ');
                logger.info(body);
                resolve(body)
            });

        });
    }

    CurrentlyPlaying(_accessToken:string) {
        logger.info(_accessToken);
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
                logger.info(error);
                logger.info(response.statusCode);
                logger.info(response.body);
                logger.info(body);
                resolve(body && {
                    "id": body.item.id,
                    "name": body.item.name,
                    "progress_ms": body.progress_ms,
                    "uri": body.item.uri
                })
            });
        });
    }


    syncUsers(userToJoin: User, joiner: User) {
        return spotifyService.CurrentlyPlaying(userToJoin.accessToken)
                .then((song: any) => {
                    logger.info("playing song: " + song.name);
                   const uriSong = song.uri;
                   const progressMs = song.progress_ms;
                   return spotifyService.playSame(joiner.accessToken, uriSong, progressMs)
                        .then((response) => {
                            logger.info(response);
                            logger.info(joiner.name +  " joined!");
                            return {response, song};
                        })
                        .catch((error) => {
                            logger.info(joiner.name +  " failed to join!!");
                            logger.error(error);
                            return error;
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

    player(_accessToken: string, id: string, play: boolean) {
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
                        logger.info("active devices is " + device.id);
                        resolve(device.id);
                    }
                }
                // TODO
                resolve("")
            });

        });
    }

}

export let spotifyService : SpotifyService = new SpotifyService(
    "9dc9612b49ac4e9bba44e1ecc936b188",
    "ff2c9b01d6c941819d4ec3a1af126e82"
);