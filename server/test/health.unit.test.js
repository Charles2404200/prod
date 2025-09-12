/**
 * Health Endpoint (unit-ish)
 *
 * Tiny express app with a /api/health endpoint to ensure 200 + { ok: true }.
 */

const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

describe('Health check endpoint', () => {
  test('GET /api/health → 200 & ok:true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
