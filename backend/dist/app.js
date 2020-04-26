"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const spotifyService_1 = require("./spotifyService");
const DbManager_1 = require("./DbManager");
const RoomManager_1 = require("./RoomManager");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const User_1 = require("./models/User");
const http = __importStar(require("http"));
const Logger_1 = require("./logging/Logger");
const PORT = 3000;
let app = express();
exports.server = http.createServer(app);
app.get("", (_req, res) => {
    res.send("NOD server is ON");
});
exports.server.listen(PORT, () => {
    Logger_1.logger.info(`Server is listening on ${PORT}`);
});
process.title = "nod-backend";
process.on("SIGTERM", () => {
    Logger_1.logger.info("SIGTERM signal received.");
    exports.server.close();
});
// handling CORS
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});
const scopes = "user-read-private user-read-email user-follow-read streaming app-remote-control user-modify-playback-state playlist-read-collaborative user-read-playback-state user-modify-playback-state";
spotifyService_1.spotifyService.redirectUrl = "http://localhost:4200/callback";
app.get("/authenticate", (req, res) => {
    const authCode = req.query.code || null;
    spotifyService_1.spotifyService.authenticate(authCode)
        .then((authResponse) => {
        Logger_1.logger.info("risposta da auth:");
        Logger_1.logger.info(authResponse);
        if (authResponse.id) {
            DbManager_1.userDBManager.addOrUpdateUser(new User_1.User({
                _id: authResponse.id,
                name: authResponse.name,
                accessToken: authResponse.access_token,
                refreshToken: authResponse.refresh_token,
                expirationDate: authResponse.expires_in,
                pictureUrl: authResponse.pictureUrl
            })).subscribe((user) => {
                if (user !== null) {
                    res.send(user);
                }
                else {
                    res.send({ error: "error during upsert!" });
                }
            }, (err) => {
                Logger_1.logger.info(err);
                res.send(err);
            });
        }
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
app.get("/updateToken", (_req, res) => {
    Logger_1.logger.info("no access token or token is exprired, rinnovo");
    Logger_1.logger.info("ricevuto code " + _req.query.code);
    DbManager_1.userDBManager.getUserById(_req.query.id).subscribe((_user) => {
        Logger_1.logger.info(_user);
        if (!_user) {
            spotifyService_1.spotifyService.updateToken(_user.refreshToken)
                .then((val) => {
                _user.accessToken = val.access_token;
                DbManager_1.userDBManager.addOrUpdateUser(_user).subscribe(() => {
                    res.send({ accesst_token: val.access_token });
                }, (err) => {
                    res.send(err);
                });
            })
                .catch((error) => {
                Logger_1.logger.info(error);
                Logger_1.logger.info("rinnovo NOT successful - redirect to login");
                res.send({ status: 500 });
            });
        }
    });
});
app.get("/login", (_req, res) => {
    Logger_1.logger.info("CALLBACK to LOGIN");
    // creo sessione anonima aka addSessions() => entry = uuid, ''
    res.send({
        redirectUrl: "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" + spotifyService_1.spotifyService.clientId +
            (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
            "&redirect_uri=" + encodeURIComponent(spotifyService_1.spotifyService.redirectUrl.toString()),
    });
});
app.get("/me", (_req, res) => {
    spotifyService_1.spotifyService.me(_req.query.access_token)
        .then((response) => {
        res.send(response);
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
app.get("/users", (_req, res) => {
    Logger_1.logger.info("ricevuto tokn " + _req.query.access_token);
    DbManager_1.userDBManager.getUsers()
        .subscribe((loeggedUsers) => {
        Logger_1.logger.info("logged users: ");
        Logger_1.logger.info(loeggedUsers);
        res.send(loeggedUsers);
    }, (err) => {
        Logger_1.logger.info(err);
        res.send(err);
    });
});
app.get("/friends", (_req, res) => {
    Logger_1.logger.info("ricevuto tokn " + _req.query.access_token);
    DbManager_1.userDBManager.getUsers()
        .subscribe((loggedUsers) => {
        Logger_1.logger.info("logged users: ");
        Logger_1.logger.info(loggedUsers);
        res.send(loggedUsers.filter(user => {
            Logger_1.logger.info("Hi, for me this token");
            Logger_1.logger.info(user.accessToken);
            Logger_1.logger.info("ïs the same of ");
            Logger_1.logger.info(_req.query.access_token);
            Logger_1.logger.info(user.accessToken !== _req.query.access_token);
            return user.accessToken !== _req.query.access_token;
        }).map(user => {
            return {
                name: user.name, pictureUrl: user.pictureUrl, _id: user._id, roomId: user.rooomId
            };
        }));
    }, (err) => {
        Logger_1.logger.info(err);
        res.send(err);
    });
});
app.get("/join", (_req, res) => {
    join(_req.query.access_token, _req.query.user_id_to_join)
        .subscribe((val) => {
        res.send(val);
    });
});
function join(userAccessToken, userIdToJoin) {
    Logger_1.logger.info("start joining");
    let uriSong;
    let progressMs;
    let i = 0;
    const userToJoin$ = DbManager_1.userDBManager.getUserById(userIdToJoin).pipe(operators_1.take(1));
    const userJoiner$ = DbManager_1.userDBManager.getUserByAccessToken(userAccessToken).pipe(operators_1.take(1));
    //TODO: replace with http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-zip
    let usersResult$ = rxjs_1.combineLatest([userToJoin$, userJoiner$]).pipe(operators_1.map(([userToJoin, userJoiner]) => ({ userToJoin, userJoiner })), operators_1.take(1));
    return usersResult$.pipe(operators_1.switchMap(result => {
        Logger_1.logger.info("userToJoin");
        Logger_1.logger.info(result.userToJoin);
        Logger_1.logger.info("userToJoiner");
        Logger_1.logger.info(result.userJoiner);
        return RoomManager_1.roomManager.joinRoom(result.userToJoin, result.userJoiner);
    }));
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
    Logger_1.logger.info("end joining");
}
app.get("/currently-playing", (_req, res) => {
    spotifyService_1.spotifyService.CurrentlyPlaying(_req.query.access_token)
        .then((response) => {
        res.send(response);
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
app.get("/play", (_req, res) => {
    spotifyService_1.spotifyService.play(_req.query.access_token)
        .then((response) => {
        res.send(response);
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
app.get("/player", (_req, res) => {
    spotifyService_1.spotifyService.player(_req.query.access_token, _req.query.id, _req.query.play)
        .then((response) => {
        res.send(response);
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
app.get("/player/devices", (_req, res) => {
    spotifyService_1.spotifyService.devices(_req.query.access_token)
        .then((response) => {
        Logger_1.logger.info(response);
        res.send(response);
    })
        .catch((error) => {
        Logger_1.logger.error(error);
        res.send(error);
    });
});
//# sourceMappingURL=app.js.map