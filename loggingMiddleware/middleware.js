const { logEvent } = require('./logger');

function requestLogger(req, res, next) {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  logEvent(`HTTP ${method} ${url} at ${timestamp}`);
  next();
}

module.exports = { requestLogger };