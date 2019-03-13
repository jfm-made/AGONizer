module.exports = {
  apps : [{
    name: 'agonizer',
    script: 'build/server/index.js',

    instances: 1,
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development',
      DEBUG: 'server:*'
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: 'server:*'
    }
  }]
};
