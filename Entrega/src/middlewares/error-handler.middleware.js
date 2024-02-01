import EnumsError from "../utils/EnumsError.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
  console.error(error.cause || error.message);
  switch (error.code) {
    case EnumsError.BAD_REQUEST_ERROR:
      res.status(400).json({ status: 'error', message: 'request error' });
      break;
    case EnumsError.INVALID_PARAMS_ERROR:
      res.status(400).json({ status: 'error', message: 'invalid params error' });
      break;
    case EnumsError.DATA_BASE_ERROR:
      res.status(400).json({ status: 'error', message: 'database error' });
      break;
    case EnumsError.ROUTING_ERROR:
      res.status(400).json({ status: 'error', message: 'routing error' });
      break;
    default:
      res.status(500).json({ status: 'error', message: error.message });
  }
}