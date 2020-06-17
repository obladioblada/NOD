module.exports = {
  apps : [{
    name: "nod",
    script: "dist/backend/src/app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      SPOTIFY_CALLBACK: process.env.HEROKU_APP_NAME !== undefined ? "https://" +  process.env.HEROKU_APP_NAME + ".herokuapp.com/callback":
          "http://localhost:3000/callback"
    }
  }]
};
