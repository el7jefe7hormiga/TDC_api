const { config } = require("dotenv");
const fs = require('fs');
config();

/* para la API */
const PORT = process.env.PORT || 2553;
const HOST = process.env.HOST || 'localhost';

/* para la BD */
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_PORT = process.env.DB_PORT


// Configuración de SSL para la conexión a la base de datos, si es requerida
const sslConfig = process.env.DB_SSL === 'true' ? {
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA ? fs.readFileSync(process.env.DB_SSL_CA).toString() : undefined,
    key: process.env.DB_SSL_KEY ? fs.readFileSync(process.env.DB_SSL_KEY) : undefined,
    cert: process.env.DB_SSL_CERT ? fs.readFileSync(process.env.DB_SSL_CERT) : undefined,
  }
} : {};

module.exports = {
  PORT,
  HOST,
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT
}