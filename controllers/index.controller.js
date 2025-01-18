// controllers/index.controller.js
// Requiere Node.js, Express, Nodemailer, dotenv y Tailwind
// npm install express nodemailer dotenv cookie-parser bcrypt
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


let tempPassword = null;

const login = async (req, res) => {
  const { username } = req.body;
  if (username === process.env.USERNAME) {
    const randomPassword = Math.random().toString(36).slice(-6);
    bcrypt.hash(randomPassword, 10, (err, hash) => {
      if (err) {
        return res.status(500).send('Error generando contraseña');
      }
      tempPassword = hash;
      const mailOptions = {
        from: process.env.SMTP_EMAIL_USERNAME,
        to: process.env.EMAIL,
        subject: 'Código de acceso',
        text: `Tu código de acceso es: ${randomPassword}`
      };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.SMTP_GOOGLE_HOST,
        port: process.env.SMTP_GOOGLE_PORT,
        auth: {
          user: process.env.SMTP_EMAIL_USERNAME, // Tu correo
          pass: process.env.SMTP_EMAIL_PASSWORD // Contraseña de app del correo
        }
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send('Error enviando correo');
        }
        res.send('Código enviado al correo. Verifica tu email.');
      });
    });
  } else {
    res.status(401).send('Usuario incorrecto');
  }
};

const verify = async (req, res) => {
  const { password } = req.body;
  bcrypt.compare(password, tempPassword, (err, result) => {
    if (result) {
      const token = bcrypt.hashSync(password, 10);
      tempPassword = null;  // limpio el password temporal
      res.status(200).json({ status: 'success', message: 'Autenticación exitosa.', token: token });
    } else {
      res.status(401).json({ status: 'error', message: 'Contraseña incorrecta.' });
    }
  });
}

/*
http://ruta/api/  ->  index()
*/
const index = (req, res) => res.json({ message: "Bienvenido a la api_TDC" });

/*
http://ruta/api/ping
*/
const ping = async (req, res) => {
  const [result] = await pool.query("SELECT 'PONG' as result");
  res.json(result[0].result);
};

module.exports = {
  login,
  verify,
  index,
  ping
}
module.exports = { login, verify, index, ping }