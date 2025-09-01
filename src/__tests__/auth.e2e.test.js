const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new POS owner', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(res.statusCode).toBe(201);
    });
    it('should not allow duplicate email', async () => {
      await User.create({ email: 'dup@example.com', password_hash: 'hash', role: 'POS_OWNER' });
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'dup@example.com', password: 'password123' });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await User.create({ email: 'login@example.com', password_hash: '$2b$12$wJ8Qw8Qw8Qw8Qw8Qw8Qw8OQw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8Qw8', role: 'POS_OWNER', is_active: true });
    });
    it('should fail with wrong credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
    });
    // Skipping actual password hash check for brevity
  });

  describe('POST /auth/verify', () => {
    it('should fail with no token', async () => {
      const res = await request(app).post('/auth/verify');
      expect(res.statusCode).toBe(401);
    });
  });
}); 