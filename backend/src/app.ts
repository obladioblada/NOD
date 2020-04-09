import express = require('express');
import {SpotifyService} from "./SpotifyService";
import {DB} from "./db";
import {User} from "./User";

let app = express();
const db = new DB();
let spotifyService = new SpotifyService(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET
);
const PORT: any = 3000;


//handling CORS
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

const scopes = 'user-read-private user-read-email user-follow-read streaming app-remote-control user-modify-playback-state playlist-read-collaborative user-read-playback-state user-modify-playback-state';
spotifyService.redirectUrl = "http://localhost:4200/callback";



app.get('/updateToken', (_req, res) => {
    console.log("no access token or token is exprired, rinnovo");
    console.log("ricevuto code " + _req.query.code);
    const _user = db.getUser(Number(_req.params.accessToken));
    const authCode = _req.query.code || null;

    spotifyService.updateToken(_req.params.accessToken, _user && _user.refreshToken, _user && _user.expirationDate,authCode)
        .then((val) => {
            console.log("rinnovo successful - next");
            console.log(val);
            res.send({accesst_token: val["access_token"]});
        })
        .catch((error) => {
            console.log(error)
            console.log("rinnovo NOT successful - redirect to login");
            res.send({status: 500});
        });
});

app.get('', (_req, res) => {
    res.send("NOD server is ON");
});

app.get('/login', (_req, res) => {
    console.log("CALLBACK to LOGIN");
    console.log("prima call");
    console.log(spotifyService.clientId);
    res.send({
        redirectUrl: 'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + spotifyService.clientId +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(spotifyService.redirectUrl)
    });
});

app.get('/me', (_req, res) => {
    spotifyService.me(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/join', (_req, res) => {
    join()
        .then(() => {
            res.send("ENJOYYYY");
        });
});

async function join() {
    console.log("start joining");
    let uriSong;
    let progressMs;
    let i = 0;
    for (let [id, user] of db.USER) {
        if (i == 0) {
            await function () {
                spotifyService.CurrentlyPlaying(user.accessToken)
                    .then((song: any) => {
                        uriSong = song.uri;
                        progressMs = song.progress_ms;
                        return
                    });
            }
        } else {
            await function () {
                spotifyService.playSame(user.accessToken, uriSong, progressMs)
                    .then((response) => {
                        return response
                    })
                    .catch((error) => {
                        console.log(error);
                        return error;
                    });
            }
        }
    }
    console.log("end joining");
}


app.get('/currently-playing', (_req, res) => {
    spotifyService.CurrentlyPlaying(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});


app.get('/play', (_req, res) => {
    spotifyService.play(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player', (_req, res) => {
    spotifyService.player(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player/devices', (_req, res) => {
    spotifyService.devices(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});


app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    }
);


