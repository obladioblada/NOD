import express = require('express');
import {SpotifyService} from "./SpotifyService";
import {DB} from "./db";
import {User} from "./User";
import { configure, getLogger } from 'log4js';

const logger = getLogger("server");
logger.level = 'info';

configure({
    appenders: {
        rollingFileAppender: {type: "File", filename: "./logs/nod.log", maxLogSize: 10485760, numBackups: 3},
        consoleAppender: {type: "console"}
    },
    categories: {
        default: { appenders: [ "rollingFileAppender", "consoleAppender"], level: "INFO"}
    }
});

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

app.get('/authenticate', (req, res) => {
    const authCode = req.query.code || null;    
    spotifyService.authenticate(authCode)
    .then((authResponse: any) => {
        if (db.addUser(new User(authResponse["access_token"], authResponse.id, authResponse.name, authResponse["refresh_token"]))){
            res.send(authResponse);
        } else {
            res.send({error: 'sorry User already exist or something went wrong!'});
        }

        
    })
    .catch((error) => {
        logger.error(error);
        res.send(error);
    });
})


app.get('/updateToken', (_req, res) => {
    logger.info("no access token or token is exprired, rinnovo");
    logger.info("ricevuto code " + _req.query.code);
    let _user = db.getUser(+_req.params.id);
    if(!_user){ _user = db.getUserByAccessToken(_req.params.accessToken); }

    spotifyService.updateToken(_req.params.accessToken)
        .then((val) => {
            _user.accessToken = val["access_token"];
            db.updateUser(_user);
            res.send({accesst_token: val["access_token"]});
        })
        .catch((error) => {
            logger.info(error)
            logger.info("rinnovo NOT successful - redirect to login");
            res.send({status: 500});
        });
});

app.get('', (_req, res) => {
    res.send("NOD server is ON");
});

app.get('/login', (_req, res) => {
    logger.info("CALLBACK to LOGIN");
    //creo sessione anonima aka addSessions() => entry = uuid, ''
    res.send({
        redirectUrl: 'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + spotifyService.clientId +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(spotifyService.redirectUrl),
        //sessionId: uuid
    });
});

app.get('/me', (_req, res) => {
    spotifyService.me(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
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
    logger.info("start joining");
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
                        logger.info("selected " + song.name + " - Master: " + user.name );
                        return
                    });
            }
        } else {
            await function () {
                spotifyService.playSame(user.accessToken, uriSong, progressMs)
                    .then((response) => {
                        logger.info(user.name +  " joined!");
                        return response
                    })
                    .catch((error) => {
                        logger.info(user.name +  " failed to join!!");
                        logger.error(error);
                        return error;
                    });
            }
        }
    }
    logger.info("end joining");
}


app.get('/currently-playing', (_req, res) => {
    spotifyService.CurrentlyPlaying(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        })
});


app.get('/play', (_req, res) => {
    spotifyService.play(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        })
});

app.get('/player', (_req, res) => {
    spotifyService.player(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        })
});

app.get('/player/devices', (_req, res) => {
    spotifyService.devices(_req.params.accessToken)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        })
});


app.listen(PORT, () => {
        logger.info(`Server is listening on ${PORT}`);
    }
);

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
});


