const Router = require('express').Router;
const router = new Router();
const decoderController = require('../controllers/decoder-controller');
const validateHexMiddleware = require('../middleware/validate-hex-middleware');

/**
 * POST /decode
 * Decodes the hex payload.
 * @middleware validateHexMiddleware - Middleware to validate the hex payload.
 * @controller decoderController.getDecodedPayload - Controller method to handle the decoding of the payload.
 */
router.post('/decode', validateHexMiddleware, decoderController.getDecodedPayload);

module.exports = router;
