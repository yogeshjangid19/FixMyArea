import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('DELETE /v1/api/issues/:id', () => {
  let citizenToken;
  let adminToken;
  const fakeIssueId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    const secret = process.env.JWT_SECRET || 'yogeshhj210@1234';
    citizenToken = jwt.sign({ userId: 'user123', role: 'citizen' }, secret);
    adminToken = jwt.sign({ userId: 'admin123', role: 'admin' }, secret);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).delete(`/v1/api/issues/${fakeIssueId}`);
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 if user is not an admin', async () => {
    const res = await request(app)
      .delete(`/v1/api/issues/${fakeIssueId}`)
      .set('Authorization', `Bearer ${citizenToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return 404 if issue does not exist', async () => {
    const res = await request(app)
      .delete(`/v1/api/issues/${fakeIssueId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});
