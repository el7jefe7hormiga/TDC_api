// controllers/tdcController.js
const pool = require('../db');
var CryptoJS = require("crypto-js");
const format = require('@formkit/tempo');

const createTdc = async (req, res) => {
  const { alias, banco, numero, corte, pago, limite, interes, vencimiento, nip, logo, soporte, cvc, cmm, comision, anualidad, ultimoAbono, comentarios } = req.body;

  const SK = process.env.ENC_KEY;
  const encryptedNumero = CryptoJS.AES.encrypt(numero, SK).toString();
  const encryptedNip = CryptoJS.AES.encrypt(nip, SK).toString();
  const encryptedCvc = CryptoJS.AES.encrypt(cvc, SK).toString();
  /*
  // Decrypt
  var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  */

  try {
    const [result] = await pool.query(
      'INSERT INTO TDC (alias, banco, numero, corte, pago, limite, interes, vencimiento, nip, logo, soporte, cvc, cmm, comision, anualidad, ultimoAbono, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [alias, banco, encryptedNumero, corte, pago, limite, interes, vencimiento, encryptedNip, logo, soporte, encryptedCvc, cmm, comision, anualidad, ultimoAbono, comentarios]
    );
    res.status(201).json({
      message: 'TDC creada exitosamente!',
      tdc: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTdc = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM TDC WHERE id = ?", [id]);
    if (rows.length <= 0) {
      return res.status(404).json({ message: "Tarjeta no encontrada!" });
    }
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error, message: "Algo salió mal :(" });
  }
}

const getTdcs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM TDC;");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error, message: "Algo salió mal :(" });
  }
}

const deleteTdc = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM TDC WHERE id = ?", [id]);
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Tarjeta no encontrada!" });
    }
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: error?.message || error, message: "Algo salió mal :(" });
  }
};

const updateTdc = async (req, res) => {
  try {
    const { id } = req.params;
    const { alias, banco, numero, corte, pago, limite, interes, vencimiento, nip, logo, soporte, cvc, cmm, comision, anualidad, ultimoAbono, comentarios } = req.body;

    const SK = process.env.ENC_KEY;
    const encryptedNumero = numero ? CryptoJS.AES.encrypt(numero, SK).toString() : null;
    const encryptedNip = nip ? CryptoJS.AES.encrypt(nip, SK).toString() : null;
    const encryptedCvc = cvc ? CryptoJS.AES.encrypt(cvc, SK).toString() : null;

    const [result] = await pool.query(
      `UPDATE TDC SET 
      alias = IFNULL(?, alias), 
      banco = IFNULL(?, banco), 
      numero = IFNULL(?, numero), 
      corte = IFNULL(?, corte), 
      pago = IFNULL(?, pago), 
      limite = IFNULL(?, limite), 
      interes = IFNULL(?, interes), 
      vencimiento = IFNULL(?, vencimiento), 
      nip = IFNULL(?, nip), 
      logo = IFNULL(?, logo), 
      soporte = IFNULL(?, soporte), 
      cvc = IFNULL(?, cvc), 
      cmm = IFNULL(?, cmm), 
      comision = IFNULL(?, comision), 
      anualidad = IFNULL(?, anualidad), 
      ultimoAbono = IFNULL(?, ultimoAbono), 
      comentarios = IFNULL(?, comentarios)
      WHERE id = ?`,
      [alias, banco, encryptedNumero, corte, pago, limite, interes, vencimiento, encryptedNip, logo, soporte, encryptedCvc, cmm, comision, anualidad, ultimoAbono, comentarios, id]
    );
    //console.log(result);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Tdc no encontrado!" });
    const [rows] = await pool.query("SELECT * FROM TDC WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error, message: "Algo salió mal :(" });
  }
};

const getSuggestions = async (req, res) => {
  const today = new Date();
  try {
    const [tdcs] = await pool.query('SELECT * FROM TDC');
    const suggestions = tdcs.flatMap(tdc => {
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      const corteDate = new Date(currentYear, currentMonth, tdc.corte);
      const pagoDate = new Date(currentYear, currentMonth, tdc.pago);

      // Ajustando fechas al próximo mes si ya pasaron
      if (today > corteDate) corteDate.setMonth(corteDate.getMonth() + 1);
      if (today > pagoDate) pagoDate.setMonth(pagoDate.getMonth() + 1);

      // Eventos:
      const nextCorte = new Date(corteDate);
      const nextPago = new Date(pagoDate);
      const _abono = (today > corteDate && today < pagoDate);  // hoy estamos dentro del dia de corte y el dia de pago ?
      const _corteEn3dias = (format.diffDays(nextCorte, today) <= 3)  // fecha de corte dentro de 3 diaas.         new Date(nextCorte.setDate(nextCorte.getDate() - 3))
      const _pagoEn8dias = (format.diffDays(nextPago, today) <= 8)    // pago dentro de 8 dias                       new Date(nextPago.setDate(nextPago.getDate() - 8))
      const _corteEn7dias = (format.diffDays(nextCorte, today) <= 7)   // corte en 7 dias

      // Generando sugerencias
      const messages = [];
      messages.push({
        type: 'info',
        title: 'Fechas Importantes',
        message: `<div >Corta el ${format.format(corteDate, 'full')}. <i class="text-sm text-gray-500 "> 
                  en ${format.diffDays(corteDate, today, 'ceil')} dias</i></div>
                  <div >Pagar el ${format.format(pagoDate, 'full')}. <i class="text-sm text-gray-500 "> 
                  en ${format.diffDays(pagoDate, today, 'ceil')} dias</i></div>`
      })

      if (_abono) {
        messages.push({
          type: 'info',
          title: 'Abono',
          message: `Abono pendiente para antes del ${format.format(pagoDate, 'full')}. 
                    <div class="text-sm text-gray-500 italic"> 📆  En ${format.diffDays(nextPago, today, 'ceil')} dias</div>`
        });
      }

      if (_corteEn3dias) {
        messages.push({
          type: 'warning',
          title: 'Fecha de corte',
          message: `Para el ${format.format(nextCorte, 'full')}.
                    <div class="text-sm text-gray-500 italic"> 📆  En ${format.diffDays(nextCorte, today, 'ceil')} dias</div>`
        });
      }

      if (_pagoEn8dias) {
        messages.push({
          type: 'warning',
          title: 'Fecha de pago',
          message: `Recuerda pagar la tarjeta antes del ${format.format(nextPago, 'full')}.
                    <div class="text-sm text-gray-500 italic"> 📆  En ${format.diffDays(nextPago, today, 'ceil')} dias</div>`
        });
      }

      if (tdc.cmm > 0 && _corteEn7dias) {
        messages.push({
          type: 'question',
          title: 'Consumo Mínimo Mensual',
          message: `🛒 Tienes ${format.diffDays(nextCorte, today, 'ceil')} dias para hacer la compra minima ($${tdc.cmm}) y evitar la comisión de $${tdc.comision}.`
        });
      }
      return { alias: tdc.alias, subtitle: tdc.banco, logo: tdc.logo, messages: messages };
    });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTdc,
  getTdc,
  getTdcs,
  deleteTdc,
  updateTdc,
  getSuggestions
}  