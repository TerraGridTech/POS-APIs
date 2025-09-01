const request = require('supertest');
const app = require('../app');
const { sequelize, User, POSDevice } = require('../models');
const jwt = require('jsonwebtoken');

describe('POS Endpoints', () => {
  let token, userId, deviceId;
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const user = await User.create({
      email: 'posowner@example.com',
      password_hash: 'hash',
      role: 'POS_OWNER',
      is_active: true
    });
    userId = user.id;
    token = jwt.sign({ id: userId, role: 'POS_OWNER' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /pos/register', () => {
    it('should register a new POS device', async () => {
      const res = await request(app)
        .post('/pos/register')
        .set('Authorization', `Bearer ${token}`)
        .send({ device_name: 'Register 1' });
      expect(res.statusCode).toBe(201);
      expect(res.body.device).toBeDefined();
      deviceId = res.body.device.id;
    });
    it('should fail without device_name', async () => {
      const res = await request(app)
        .post('/pos/register')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /pos/keygen', () => {
    it('should fail with invalid device_id', async () => {
      const res = await request(app)
        .post('/pos/keygen')
        .set('Authorization', `Bearer ${token}`)
        .send({ device_id: 'not-a-uuid' });
      expect(res.statusCode).toBe(400);
    });
    // More tests can be added for success case if needed
  });
}); 