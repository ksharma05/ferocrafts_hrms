const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('../../routes/auth');
const User = require('../../models/User');
const errorHandler = require('../../middleware/error');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Set up express app for testing
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/v1/auth', authRoutes);
  app.use(errorHandler);

  // Set test environment variables
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  process.env.JWT_EXPIRE = '15m';
  process.env.JWT_REFRESH_EXPIRE = '7d';
  process.env.JWT_COOKIE_EXPIRE = '7';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });

    it('should fail to register with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Test@123',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to register with weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // Too weak
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to register duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      // Register first user
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Try to register again
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();

      // Check for cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('token'))).toBe(true);
    });

    it('should fail login with invalid email', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'Test@123',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should fail login with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail login without email', async () => {
      const credentials = {
        password: 'Test@123',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail login without password', async () => {
      const credentials = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Register and get refresh token
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
        });

      refreshToken = response.body.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${refreshToken}`])
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.refreshToken).not.toBe(refreshToken); // Token rotation
    });

    it('should fail refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=invalid_token'])
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail refresh without token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let accessToken;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
        });

      accessToken = response.body.token;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Check that cookies are cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('token=;'))).toBe(true);
    });

    it('should fail logout without authentication', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

