import express = require("express");
import {SpotifyService} from "./SpotifyService";
import {DB} from "./db";
import { configure, getLogger } from "log4js";
const logger = getLogger();




logger.level = "info";

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



// handling CORS
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});




const scopes = "user-read-private user-read-email user-follow-read streaming app-remote-control user-modify-playback-state playlist-read-collaborative user-read-playback-state user-modify-playback-state";
spotifyService.redirectUrl = "http://localhost:4200/callback";

app.get("/authenticate", (req, res) => {
    const authCode = req.query.code || null;
    spotifyService.authenticate(authCode)
    .then((authResponse: any) => {
        logger.info("risposta da auth:");
        logger.info(authResponse);
        if (authResponse.id) {
            db.addOrUpdateUser({
                id: authResponse.id,
                name: authResponse.name,
                accessToken: authResponse.access_token,
                refreshToken: authResponse.refresh_token,
                expirationDate: null,
            })
                .then((user) => {
                    if (user != null) {
                        res.send(user);
                    } else {
                        res.send({error: "error during upsert!"});
                    }
                }).catch((err) => {
                res.send(err);
            });
        }
    })
    .catch((error) => {
        logger.error(error);
        res.send(error);
    });
});


app.get("/updateToken", (_req, res) => {
    logger.info("no access token or token is exprired, rinnovo");
    logger.info("ricevuto code " + _req.query.code);
    let _user:any = db.getUserById(_req.params.id);
    if(!_user) {
        _user = db.getUsedByAccessToken(_req.params.access_token);
    }

    spotifyService.updateToken(_user.refreshToken)
        .then((val: any) => {
            _user.accessToken = val.access_token;
            db.addOrUpdateUser(_user).then(() => {
                res.send({accesst_token: val.access_token});
            }).catch((err) => {
                res.send(err)
            });
        })
        .catch((error) => {
            logger.info(error);
            logger.info("rinnovo NOT successful - redirect to login");
            res.send({status: 500});
        });
});

app.get("", (_req, res) => {
    res.send("NOD server is ON");
});

app.get("/login", (_req, res) => {
    logger.info("CALLBACK to LOGIN");
    // creo sessione anonima aka addSessions() => entry = uuid, ''
    res.send({
        redirectUrl: "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" + spotifyService.clientId +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" + encodeURIComponent(spotifyService.redirectUrl),
        // sessionId: uuid
    });
});

app.get("/me", (_req, res) => {
    spotifyService.me(_req.params.access_token)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/join", (_req, res) => {
    join(_req.query.access_token)
        .then((val) => {
            res.send(val);
        });
});

async function join(masterAccessToken: string) {
    logger.info("start joining");
    let uriSong: string;
    let progressMs: string;
    let i = 0;
    // const masterUser: User = db.getUserByAccessToken(masterAccessToken);
    //logger.info("Before await "+ masterUser.id);
    spotifyService.CurrentlyPlaying(masterAccessToken)
        .then((song: any) => {
         /*   uriSong = song.uri;
            progressMs = song.progress_ms;
            logger.info("selected " + song.name + " - Master: " + masterUser.name );
            logger.info("uri " + uriSong );

            for (let [id, user] of db.USER)    {
                if (user.accessToken !== masterAccessToken) {
                    logger.info("Before playsame "+ id);
                    spotifyService.playSame(user.accessToken, uriSong, progressMs)
                        .then((response) => {
                            logger.info(response);
                            logger.info(user.name +  " joined!");
                            return response;
                        })
                        .catch((error) => {
                            logger.info(user.name +  " failed to join!!");
                            logger.error(error);
                            return error;
                        });
                } else {
                    spotifyService.playSame(masterUser.accessToken, uriSong, progressMs)
                }
            }*/
        });
    

    logger.info("end joining");
}


app.get("/currently-playing", (_req, res) => {
    spotifyService.CurrentlyPlaying(_req.query.access_token)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});


app.get("/play", (_req, res) => {
    spotifyService.play(_req.query.access_token)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/player", (_req: any, res) => {
    logger.info(_req.query.access_token);
    logger.info(_req.query.id);
    logger.info(_req.query.play);
    spotifyService.player(_req.query.access_token, _req.query.id, _req.query.play)
        .then((response) => {
            logger.info(response);
            res.send(response);
        })
        .catch((error) => {
            logger.error(error.body);
            res.send(error);
        });
});

app.get("/player/devices", (_req, res) => {
    spotifyService.devices(_req.query.access_token)
        .then((response) => {
            logger.info(response);
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});


app.listen(PORT, () => {
        logger.info(`Server is listening on ${PORT}`);
    }
);

process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received.");
});


