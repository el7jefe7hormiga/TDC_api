const express = require("express");
const cookieParser = require('cookie-parser');
//const morgan = require("morgan");

const indexRoutes = require('./routes/index.routes');
const tdcRoutes = require('./routes/tdc.routes');
const paymentRoutes = require('./routes/payment.routes');

process.env.TZ = "America/Mazatlan"
console.log(new Date().toString());

const app = express();

// Middlewaresapp.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Rutas de la API
app.use("/", [indexRoutes])
app.use('/api', [tdcRoutes, paymentRoutes]);
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada!, (/api/)" });
});
// fin del app.js


// cuando se despliegue la api al servidor, comentar las sig lineas:
/*
const { PORT, HOST, DB_USER, DB_HOST } = require("./config.js");
app.listen(PORT);
console.log(`🚀 Server on port ${HOST}:${PORT}`);
console.log(`📡 BD connection ${DB_USER} @ ${DB_HOST}`);
*/
module.exports = app;