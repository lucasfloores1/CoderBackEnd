import { logger } from "../config/logger.js";
import Exception from "../utils/exception.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  logger.error(`There was an error during the request ${req.method} - ${req.url}: ${error.message}`);
  const message = error instanceof Exception ?
    error.message :
    `Something went wrong: ${error.message}`;
  res.status(error.statusCode || 500).json({ status: 'error', message });
}