import { Request, Response, NextFunction } from 'express';

module.exports = function (req: Request, res: Response, next: NextFunction) {
  const { hexPayload } = req.body;
  console.log(hexPayload)
  // Check if the payload is a valid hexadecimal string
  const hexRegex = /^[0-9A-Fa-f]+$/;
  if (!hexPayload || !hexRegex.test(hexPayload)) {
    const error = new Error('Invalid hex payload');
    return next(error);
  }

  next();
}
