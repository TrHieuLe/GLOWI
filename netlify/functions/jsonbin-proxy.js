// netlify/functions/jsonbin-proxy.js
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const BIN_ID = process.env.JSONBIN_BIN_ID;
const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
  if (!BIN_ID || !MASTER_KEY) {
    return { statusCode: 500, body: 'Server not configured' };
  }

  const method = event.httpMethod;
  const url = `https://api.jsonbin.io/v3/b/${BIN_ID}${method === "GET" ? "/latest" : ""}`;

  // Nếu là PUT (ghi) -> xác thực admin qua JWT
  if (method === 'PUT') {
    const auth = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token) return { statusCode: 401, body: JSON.stringify({ ok: false, message: 'Missing token' }) };
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, message: 'Invalid token' }) };
    }
  }

  try {
    const resp = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: method === 'PUT' ? event.body : undefined
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + err.message };
  }
};
