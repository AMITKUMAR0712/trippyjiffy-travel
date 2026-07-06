/**
 * PM2 process manager — run from repo root:
 *   npm run pm2:start
 *   npm run pm2:restart
 */
module.exports = {
  apps: [
    {
      name: 'trippyjiffy-api',
      cwd: './Backend (5)/Backend',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'trippyjiffy-leads-api',
      cwd: './Leads-Extractor/backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '768M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
