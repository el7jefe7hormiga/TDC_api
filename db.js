const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, sslConfig } = require("./config.js");
const { createPool } = require("mysql2/promise");
const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  timezone: 'local',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig
});
module.exports = pool;