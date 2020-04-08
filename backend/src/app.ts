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


app.get('/updateToken', (req, res) => {
    console.log("no access token or token is exprired, rinnovo");
    spotifyService.authCode = req.query.code || null;
    console.log("ricevuto code " + req.query.code);
    spotifyService.updateToken()
        .then((val) => {
            console.log("rinnovo successful - next");
            console.log(val);
            spotifyService.me()
                .then((me) => {
                    let user = new User(val["access_token"], +me["id"], me["display_name"]);
                    db.addUser(user);
                    let id = user.id;
                    res.send({id, me});
                })
                .catch((error) => {
                    console.log(error);
                    res.send(error);
                })

        })
        .catch(() => {
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
    spotifyService.me()
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
                spotifyService.CurrentlyPlaying()
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
    spotifyService.CurrentlyPlaying()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});


app.get('/play', (_req, res) => {
    spotifyService.play()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player', (_req, res) => {
    spotifyService.player()
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
});

app.get('/player/devices', (_req, res) => {
    spotifyService.devices()
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


