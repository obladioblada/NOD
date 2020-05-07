module.exports = {
  apps : [{
    name: "nod",
    script: "./backend/dist/app.js",
    node_args : "--max_old_space_size=480",
    instances: "max",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      SPOTIFY_CALLBACK: "https://"+ process.env.HEROKU_APP_NAME+".herokuapp.com/callback"
    }
  }]
};
