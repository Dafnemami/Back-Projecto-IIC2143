const Router = require('koa-router');
// Importar rutas
const normalplay = require('./routes/normalplays');
const board = require('./routes/board');
const game = require('./routes/game');
const health = require('./routes/health');
const usercard = require('./routes/usercard');
const user = require('./routes/user');
const specialplay = require('./routes/specialplay');

const router = new Router();

// Rutas

// Rutas que comienzan con /normalplay
router.use('/normalplay', normalplay.routes());
// Rutas que comienzan con /board
router.use('/board', board.routes());
// Rutas que comienzan con /game
router.use('/game', game.routes());
// Rutas que comienzan con /health
router.use('/health', health.routes());
// Rutas que comienzan con /usercard
router.use('/usercard', usercard.routes());
// Rutas que comienzan con /user
router.use('/user', user.routes());

router.use('/specialplay', specialplay.routes());

module.exports = router; // Permite su uso en index.js
