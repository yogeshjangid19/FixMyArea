import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

describe('GET /health', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 OK and version', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'OK', version: '2.0.0' });
  });
});
