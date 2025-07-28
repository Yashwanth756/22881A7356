const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs.txt');

function logEvent(message) {
  const timestamp = new Date().toISOString();
  fs.appendFile(logFilePath, `[${timestamp}] ${message}\n`, err => {
    if (err) console.error('Logging error:', err);
  });
}
module.exports = { logEvent };

