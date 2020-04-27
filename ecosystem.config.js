module.exports = {
  apps : [{
    name: "nod",
    script: "./backend/dist/app.js",
    instances: "max",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
