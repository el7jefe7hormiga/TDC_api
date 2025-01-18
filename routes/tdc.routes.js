// routes/tdcRoutes.js
const { Router } = require('express');
const {
  createTdc,
  getTdc,
  getTdcs,
  deleteTdc,
  updateTdc,
  getSuggestions
} = require('../controllers/tdc.controller.js');

const router = Router();

// CREATE An Tdc
router.post("/tdc", createTdc);

// GET todas las Tdcs
router.get("/tdcs", getTdcs);

// GET una Tdc
router.get("/tdc/:id", getTdc);

// DELETE An Tdc
router.delete("/tdc/:id", deleteTdc);

// UPDATE AN Tdc
router.patch("/tdc/:id", updateTdc);

// GET todas las Sugerencias
router.get("/sug", getSuggestions);

module.exports = router;