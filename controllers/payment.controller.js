// controllers/paymentController.js
const db = require('../db');

exports.makePayment = async (req, res) => {
  const { tdcId, monto, msi, comentario } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Payments (tdcId, monto, msi, comentario, fecha) VALUES (?, ?, ?, ?, ?)',
      [tdcId, monto, msi, comentario, new Date()]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};