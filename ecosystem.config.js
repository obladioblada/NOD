module.exports = {
  apps : [{
    name: "nod",
    script: "./backend/dist/app.js",
    node_args : "--max_old_space_size=480",
    instances: "max",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development",
      SPOTIFY_CALLBACK: "http://localhost/callback"
    },
    env_production: {
      NODE_ENV: "production",
      SPOTIFY_CALLBACK: "http://localhost/callback"
    }
  }]
};
