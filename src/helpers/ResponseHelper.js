import Logger from '../logger/logger';

export function getErrorResponse(res, status, message) {
  Logger.error(`Response error with STATUS: ${status} and MESSAGE: ${message}`);
  return res.status(status).send(message);
}

export function getSuccessResponse(res, status, data) {
  Logger.info(`Send successful response with STATUS: ${status} and DATA: ${data}`);
  return res.status(status).json(data);
}

export function getMessageResponse(res, status, message) {
  Logger.info(`Send message response with STATUS: ${status} and MESSAGE: ${message}`);
  return res.status(status).send(message);
}
