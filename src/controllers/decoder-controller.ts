import { Request, Response, NextFunction } from 'express';
const decoderService = require('../service/decoder-service');

class DecoderController {
  async getDecodedPayload(req: Request, res: Response, next: NextFunction) {
    try {
      const { hexPayload } = req.body;
      const decodedData = await decoderService.decodePayload(hexPayload);

      return res.json(decodedData);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new DecoderController();
