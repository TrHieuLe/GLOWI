const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;
  const JWT_SECRET = process.env.JWT_SECRET;
  const method = event.httpMethod;

  if (!BIN_ID || !MASTER_KEY) {
    return { statusCode: 500, body: 'Server not configured' };
  }

  // === Kiểm tra token cho cả GET và PUT (chỉ admin xem được dữ liệu) ===
  if (method === 'GET' || method === 'PUT') {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, message: 'Missing token' }) };
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return { statusCode: 401, body: JSON.stringify({ ok: false, message: 'Invalid token' }) };
    }
  }

  // === Proxy request tới JSONBin ===
  const url = `https://api.jsonbin.io/v3/b/${BIN_ID}${method === "GET" ? "/latest" : ""}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      },
      body: method === 'PUT' ? event.body : undefined
    });

    const data = await res.text();
    return { statusCode: res.status, headers: { 'Content-Type': 'application/json' }, body: data };
  } catch (err) {
    return { statusCode: 500, body: 'Error: ' + err.message };
  }
};
