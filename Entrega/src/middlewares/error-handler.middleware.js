import EnumsError from "../utils/EnumsError.js";
import { logger } from "../config/logger.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  logger.error(error.cause || error.message);
  switch (error.code) {
    case EnumsError.BAD_REQUEST_ERROR:
      req.logger.error(`${error.cause}`);
      res.status(400).json({ status: 'error', cause : error.cause });
      break;
    case EnumsError.INVALID_PARAMS_ERROR:
      req.logger.error(`${error.cause}`);
      res.status(400).json({ status: 'error', cause: error.cause });
      break;
    case EnumsError.DATA_BASE_ERROR:
      req.logger.error(`${error.cause}`);
      res.status(400).json({ status: 'error', cause: error.cause });
      break;
    case EnumsError.ROUTING_ERROR:
      req.logger.error(`${error.cause}`);
      res.status(400).json({ status: 'error', cause: error.cause });
      break;
    default:
      req.logger.error(`${error.cause}`);
      res.status(500).json({ status: 'error', cause: error.cause });
  }
}