module.exports = {
  apps : [{
    name   : "server",
    script : "./dist/index.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
