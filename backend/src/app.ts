import express = require("express");
import {spotifyService} from "./spotifyService";
import {userDBManager} from "./UserDbManager";
import {roomDbManager} from "./RoomDbManager";
import {combineLatest, Observable} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
import * as http from 'http';
import {logger} from "./logging/Logger";
import {IUserDocument} from "./models/User";
import {socketManager} from "./SocketManager";
import {db} from "./DbManager"
import path from "path";

let bodyParser = require('body-parser');

db.init();

const scopes = "user-read-private user-read-email user-follow-read streaming app-remote-control user-modify-playback-state playlist-read-collaborative user-read-playback-state user-modify-playback-state";
spotifyService.redirectUrl = (process.env.SPOTIFY_CALLBACK || "http://localhost:4200/callback");


const PORT: any = ( process.env.PORT || 3000 );
let app = express();
export const server = http.createServer(app);
socketManager.init(server);
server.listen(PORT, () => {
        logger.info(`Server is listening on ${PORT}`);
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

process.title = "nod-backend";

process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received.");
    server.close();
});

process.on('SIGINT', () => {
    logger.info("SIGINT signal received.");
    server.close();
});


// handling CORS
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});





app.get("/api/authenticate", (req, res) => {
    const authCode = req.query.code || null;
    logger.info(authCode);
    spotifyService.authenticate(authCode as string)
        .then((authResponse: any) => {
            logger.info(authResponse);
            logger.info("risposta da auth:");
            logger.info(authResponse);
            if (authResponse.id) {
                userDBManager.addOrUpdateUser({
                    _id: authResponse.id,
                    name: authResponse.name,
                    accessToken: authResponse.access_token,
                    refreshToken: authResponse.refresh_token,
                    expiresIn: authResponse.expires_in,
                    pictureUrl: authResponse.pictureUrl
                } as IUserDocument).subscribe((user) => {
                    logger.info(user);
                    if (user !== null) {
                        res.send(user);
                    } else {
                        res.send({error: "error during upsert!"});
                    }
                }, (err) => {
                    logger.info(err);
                    res.send(err);
                });
            }
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});


app.post("/api/refreshToken", (_req, res) => {
   const accessToken =_req.body.access_token;
   const refreshToken =_req.body.refresh_token;
   console.log("update user with accessToken : " + accessToken);
    userDBManager.getUserByAccessToken(accessToken).subscribe((_user: IUserDocument) => {
        if (_user) {
            console.log(refreshToken);
            spotifyService.refreshToken(refreshToken, accessToken)
                .then((val: any) => {
                    console.log("got new access token" + val.access_token);
                    _user.accessToken = val.access_token;
                    userDBManager.addOrUpdateUser(_user).subscribe(() => {
                        res.send(val);
                    }, (err) => {
                        res.send(err);
                    });
                })
                .catch((error) => {
                    logger.info(error);
                    logger.info("rinnovo NOT successful - redirect to login");
                    res.send({status: 500});
                });
        } else {
            console.log(_user);
            console.log("user not found");
            res.sendStatus(400);
        }
    });
});


app.get("/api/call401", (_req, res) => {
    res.sendStatus(401);
});

app.get("/api/login", (_req, res) => {
    res.send({
        redirectUrl: "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" + spotifyService.clientId +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" + encodeURIComponent(spotifyService.redirectUrl)
        // sessionId: uuid
    });
});

app.get("/api/me", (_req, res) => {
    spotifyService.me(_req.query.access_token as string)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/api/users", (_req, res) => {
    logger.info("ricevuto tokn " + _req.query.access_token);
    userDBManager.getUsers()
        .subscribe((loeggedUsers) => {
                logger.info("logged users: ");
                logger.info(loeggedUsers);
                res.send(loeggedUsers);
            },
            (err) => {
                logger.info(err);
                res.send(err);
            });
});

app.get("/api/friends", (_req, res) => {
    logger.info("ricevuto tokn " + _req.query.access_token);
    userDBManager.getUsers()
        .subscribe((loggedUsers) => {
                logger.info("logged users: ");
                logger.info(loggedUsers);
                res.send(loggedUsers.filter(user => {
                    return user.accessToken !== _req.query.access_token
                }).map((user: IUserDocument) =>  IUserDocument.marshal(user)));
            },
            (err) => {
                logger.info(err);
                res.send(err);
            });
});


app.get("/api/join", (_req, res) => {
    join(_req.query.access_token as string, _req.query.user_id_to_join as string)
        .subscribe((val) => {
            res.send(val);
        });
});

function join(userAccessToken: string, userIdToJoin: string): Observable<any> {
    logger.info("start joining");
    let uriSong: string;
    let progressMs: string;
    let i = 0;

    const userToJoin$: Observable<IUserDocument> = userDBManager.getUserById(userIdToJoin).pipe(take(1));
    const userJoiner$: Observable<IUserDocument> = userDBManager.getUserByAccessToken(userAccessToken).pipe(take(1));


    //TODO: replace with http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-zip
    let usersResult$: Observable<any> = combineLatest([userToJoin$, userJoiner$]).pipe(
        map(([userToJoin, userJoiner]) => ({userToJoin, userJoiner})),
        take(1));

    return usersResult$.pipe(switchMap(result => {
            logger.info("userToJoin");
            logger.info(result.userToJoin);
            logger.info("userToJoiner");
            logger.info(result.userJoiner);
            return roomDbManager.joinRoom(result.userToJoin, result.userJoiner);
        })
    );

    /* db.getUserByAccessToken(userAccessToken)
    .then((masterUser) => {
        logger.info("Before await "+ masterUser._id);
        spotifyService.CurrentlyPlaying(userAccessToken)
        .then((song: any) => {
         uriSong = song.uri;
        progressMs = song.progress_ms;
        logger.info("selected " + song.name + " - Master: " + masterUser.name );
        logger.info("uri " + uriSong );
        db.getUsers()
            .then((users)=> {
                users.forEach(user => {
                if (user.accessToken !== userAccessToken) {
                    logger.info("Before playsame "+ user._id);

                } else {
                    spotifyService.playSame(masterUser.accessToken, uriSong, progressMs);
                }
            });
           })
           .catch((err)=> {
                logger.info(err);
                return err;
           });
        });
    })
    .catch((err)=> {
        logger.error((err) => {
            logger.error(err);
            return err;
        });
    });
    */
}

app.get("/api/currently-playing", (_req, res) => {
    spotifyService.CurrentlyPlaying(_req.query.access_token as string)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/api/play", (_req, res) => {
    spotifyService.play(_req.query.access_token as string)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/api/player", (_req: any, res) => {
    let play;
    if (_req.query.play === "true" || _req.query.play === "false") {
        play = JSON.parse(_req.query.play);
    } else {
        res.sendStatus(400);
    }
    spotifyService.player(_req.query.access_token as string, _req.query.id as string, play === true as boolean)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});

app.get("/api/player/devices", (_req, res) => {
    spotifyService.devices(_req.query.access_token as string)
        .then((response) => {
            logger.info(response);
            res.send(response);
        })
        .catch((error) => {
            logger.error(error);
            res.send(error);
        });
});


if (process.env.NODE_ENV === "production") {
    logger.info(" binding angular");
    let dist = path.join(__dirname, './../../');
    app.use(express.static(dist));
    app.get("/*", (_req, res) => {
        logger.info("sending " + path.join(dist,"index.html"));
        res.sendFile(path.join(dist,"index.html"));
    });
}