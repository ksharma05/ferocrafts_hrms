const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user successfully with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should fail to create user without required fields', async () => {
      const user = new User({});

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail to create user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Test@123',
        role: 'employee',
      };

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should fail to create duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      };

      await User.create(userData);

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Test@123';
      const user = await User.create({
        email: 'test@example.com',
        password: plainPassword,
        role: 'employee',
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash format
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      });

      const originalHash = user.password;
      user.email = 'newemail@example.com';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('Password Matching', () => {
    it('should correctly match valid password', async () => {
      const plainPassword = 'Test@123';
      const user = await User.create({
        email: 'test@example.com',
        password: plainPassword,
        role: 'employee',
      });

      const isMatch = await user.matchPassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it('should reject invalid password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      });

      const isMatch = await user.matchPassword('WrongPassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate valid access token', () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      });

      const token = user.getSignedJwtToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT format
    });

    it('should generate valid refresh token', () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'Test@123',
        role: 'employee',
      });

      const token = user.getSignedRefreshToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('User Roles', () => {
    it('should default to employee role', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Test@123',
      });

      expect(user.role).toBe('employee');
    });

    it('should accept valid roles', async () => {
      const roles = ['employee', 'manager', 'admin'];

      for (const role of roles) {
        const user = await User.create({
          email: `${role}@example.com`,
          password: 'Test@123',
          role,
        });

        expect(user.role).toBe(role);
      }
    });
  });
});

