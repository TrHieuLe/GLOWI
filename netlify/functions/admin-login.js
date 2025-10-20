// netlify/functions/admin-login.js
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const pw = (body.password || '').toString();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_PASSWORD || !JWT_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, message: 'Server not configured' }) };
    }

    if (pw !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, message: 'Invalid password' }) };
    }

    // Tạo token (ví dụ thời hạn 6 giờ)
    const token = jwt.sign({ role: 'admin', t: Date.now() }, JWT_SECRET, { expiresIn: '6h' });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, token })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, message: err.message }) };
  }
};
