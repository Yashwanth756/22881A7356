const express = require('express');
const router = express.Router();
const { generateShortCode } = require('../utils/generateCode');
const { isValidHttpUrl } = require('../utils/validateUrl');
const { logEvent } = require('../../loggingMiddleware/logger');
const db = require('../db');

router.post('/shorten', (req, res) => {
  const { longUrl, customCode, validityMinutes } = req.body;
    console.log(validityMinutes)
  if (!isValidHttpUrl(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = customCode || generateShortCode();

  if (db[code]) {
    return res.status(409).json({ error: 'Short code already in use' });
  }

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + (validityMinutes || 30) * 60000);

  db[code] = { longUrl, createdAt, expiresAt };
  logEvent(`URL shortened: ${code} -> ${longUrl}`);
  console.log(code)
  res.json({ shortUrl: `http://localhost:5000/api/url/${code}` });
});

router.get('/:code', (req, res) => {
  const { code } = req.params;
  const record = db[code];

  if (!record) {
    logEvent(`Invalid redirect attempt for code: ${code} (not found)`);
    return res.status(404).json({ error: 'Not found' });
  }

  const now = new Date();
  const isExpired = now > new Date(record.expiresAt);

  if (isExpired) {
    delete db[code];
    logEvent(`Expired URL access attempt: ${code}`);
    return res.status(410).json({ error: 'URL expired' });
  }

  logEvent(`Redirecting ${code} -> ${record.longUrl}`);
  res.redirect(record.longUrl);
  // res.send('hello')
});

module.exports = router;
