/**
 * Express Integration (basic)
 *
 * Spins up a tiny express app:
 * - GET /health → { status: "ok" }
 * - GET /ping → "pong"
 * - POST /api/echo → echoes payload with a small extra
 */

const request = require('supertest');
const express = require('express');

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/ping', (req, res) => res.send('pong'));

  app.post('/api/echo', (req, res) => {
    res.json({ received: req.body, extra: 'ok' });
  });
});

describe('Basic integration endpoints', () => {
  test('GET /health → 200 + payload', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /ping → pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('pong');
  });

  test('POST /api/echo → returns same payload', async () => {
    const payload = { message: 'Hello World', meta: { id: 123 } };
    const res = await request(app)
      .post('/api/echo')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.received).toEqual(payload);
    expect(res.body.extra).toBe('ok');
  });
});
