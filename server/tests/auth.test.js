const request = require('supertest');
const express = require('express');

jest.mock('../model/user', () => {
  const mockUser = {
    _id: 'mockId123',
    name: 'Test User',
    email: 'test@test.com',
    phone_number: '0600000000',
    role: 'agent',
    comparePassword: jest.fn().mockResolvedValue(true),
    createPasswordResetToken: jest.fn().mockReturnValue('resettoken123'),
    save: jest.fn().mockResolvedValue(true),
  };
  return {
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
  };
});

jest.mock('../config/mailer', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

const User = require('../model/user');

const app = express();
app.use(express.json());
const userRoutes = require('../routes/user.routes');
app.use('/api/user', userRoutes);

describe('Auth Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('POST /api/user/signup - devrait créer un utilisateur', async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/user/signup').send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'agent',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/user/signup - devrait rejeter un utilisateur existant', async () => {
    User.findOne.mockResolvedValue({ email: 'test@test.com' });
    const res = await request(app).post('/api/user/signup').send({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Utilisateur déjà existant');
  });

  test('POST /api/user/loginByEmail - connexion réussie', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockId',
        email: 'test@test.com',
        role: 'agent',
        comparePassword: jest.fn().mockResolvedValue(true),
      }),
    });
    const res = await request(app).post('/api/user/loginByEmail').send({
      email: 'test@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/user/loginByEmail - mauvais mot de passe', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockId',
        comparePassword: jest.fn().mockResolvedValue(false),
      }),
    });
    const res = await request(app).post('/api/user/loginByEmail').send({
      email: 'test@test.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/user/forgot-password - email non trouvé', async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/user/forgot-password').send({ email: 'unknown@test.com' });
    expect(res.status).toBe(404);
  });
});
