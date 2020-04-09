import{ Observable } from "rxjs";

const request = require('request');

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
    updateToken(_accessToken?: string, _refreshToken?: string, _expirationDate?: number,_authCode?:string) {
        let authOptions;
        if ((!_accessToken && !_refreshToken && !_expirationDate)) {
            console.log("setting login options");
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
        } else if ((_refreshToken) && (this.isTokenExpried(_expirationDate))) {
            authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {'Authorization': 'Basic ' + ( Buffer.from(this._clientId + ':' + this._secretClient).toString('base64'))},
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: _refreshToken
                },
                json: true
            };
        }
        return this.authenticate(authOptions,_accessToken,_refreshToken,_expirationDate);
    }

    authenticate(authOptions: any, _accessToken: string, _refreshToken: string,_expirationDate: number) {
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                console.log("from Post for token");
                console.log(response.statusCode);
                if (!error && response.statusCode === 200) {
                    console.log(body)
                    if (body.access_token) {
                        console.log("setto access token col cazzo de valore "+body.access_token);
                        _accessToken = body.access_token;
                        console.log("this.accessToken  " + _accessToken);
                    }
                    console.log("refresh token :  " + body.refresh_token);

                    if (body.refresh_token !== undefined) {
                        _refreshToken = body.refresh_token;
                        console.log("settaggio refresh : " + _refreshToken)
                    }
                    if (body.expires_in !== undefined) {
                        console.log(body.expires_in);
                        _expirationDate = body.expires_in;
                    }
                    resolve({
                        status: response.statusCode,
                        access_token: _accessToken,
                        refresh_token: _refreshToken,
                        expiration_date: _expirationDate
                    });
                } else {
                    reject({
                        status: response.statusCode,
                        access_token: _accessToken,
                        refresh_token: _refreshToken,
                        expiration_date: _expirationDate
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



