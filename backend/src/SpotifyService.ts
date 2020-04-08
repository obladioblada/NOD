
const request = require('request');

export class SpotifyService {

    private _clientId: string;
    private _secretClient: string;
    private _accessToken: string;
    private _refreshToken: string;
    private _redirectUrl: string;
    private _expirationDate: number;
    private _authCode: string;

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

    get accessToken(): string {
        return this._accessToken;
    }

    set accessToken(value: string) {
        this._accessToken = value;
    }

    get refreshToken(): string {
        return this._refreshToken;
    }

    set refreshToken(value: string) {
        this._refreshToken = value;
    }

    get redirectUrl(): string {
        return this._redirectUrl;
    }

    set redirectUrl(value: string) {
        this._redirectUrl = value;
    }

    get expirationDate(): number {
        return this._expirationDate;
    }

    set expirationDate(value: number) {
        this._expirationDate = value;
    }

    get authCode(): string {
        return this._authCode;
    }

    set authCode(value: string) {
        this._authCode = value;
    }

    /**
     *  chiamata principale per login e update refresh token.
     *
     */
    updateToken() {
        let authOptions;
        if ((!this._accessToken && !this._refreshToken && !this._expirationDate)) {
            console.log("setting login options");
            authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: this._authCode,
                    redirect_uri: this._redirectUrl,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(this._clientId + ':' + this._secretClient).toString('base64'))
                },
                json: true
            };
        } else if ((this._refreshToken) && (this.isTokenExpried())) {
            authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: {'Authorization': 'Basic ' + ( Buffer.from(this._clientId + ':' + this._secretClient).toString('base64'))},
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: this._refreshToken
                },
                json: true
            };
        }
        return this.authenticate(authOptions);
    }

    authenticate(authOptions: any) {
        return new Promise((resolve, reject) => {
            request.post(authOptions, (error, response, body) => {
                console.log("from Post for token");
                console.log(response.statusCode);
                if (!error && response.statusCode === 200) {
                    console.log(body)
                    if (body.access_token) {
                        console.log("setto access token col cazzo de valore "+body.access_token);
                        this._accessToken = body.access_token;
                        console.log("this.accessToken  " + this._accessToken);
                    }
                    console.log("refresh token :  " + body.refresh_token);

                    if (body.refresh_token !== undefined) {
                        this._refreshToken = body.refresh_token;
                        console.log("settaggio refresh : " + this._refreshToken)
                    }
                    if (body.expires_in !== undefined) {
                        console.log(body.expires_in);
                        this._expirationDate = body.expires_in;
                    }
                    resolve({
                        status: response.statusCode,
                        access_token: this._accessToken,
                        refresh_token: this._refreshToken,
                        expiration_date: this._expirationDate
                    });
                } else {
                    reject({
                        status: response.statusCode,
                        access_token: this._accessToken,
                        refresh_token: this._refreshToken,
                        expiration_date: this._expirationDate
                    })
                }
            });

        });
    }

    isTokenExpried() {
        console.log("is token expired: " + (new Date().getTime() > this._expirationDate));
        return new Date().getTime() > this._expirationDate
    };

    me() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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

    CurrentlyPlaying() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/currently-playing',
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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

    play() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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

    player() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player',
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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

    activeDevices() {
        return new Promise((resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/me/player/devices',
                headers: {'Authorization': 'Bearer ' + this._accessToken},
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



