const { Router } = require('express');
const { index, ping, login, verify } = require('../controllers/index.controller.js');

const router = Router();

router.get("/", index);

router.get("/ping", ping);

router.post('/login', login);

router.post('/verify', verify)

module.exports = router;