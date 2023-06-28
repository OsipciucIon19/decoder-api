const Router = require('express').Router;
const router = new Router();
const decoderController = require('../controllers/decoder-controller');
const validateHexMiddleware = require('../middleware/validate-hex-middleware');

router.post('/decode', validateHexMiddleware, decoderController.getDecodedPayload);

module.exports = router;
