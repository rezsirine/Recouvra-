const request = require('supertest');
const app     = require('../app');

describe('Auth API', () => {

  describe('POST /api/user/loginByEmail', () => {
    it('devrait rejeter un email invalide', async () => {
      const res = await request(app)
        .post('/api/user/loginByEmail')
        .send({ email: 'pas-un-email', password: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait rejeter si mot de passe manquant', async () => {
      const res = await request(app)
        .post('/api/user/loginByEmail')
        .send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Données invalides');
    });

    it('devrait rejeter des identifiants incorrects', async () => {
      const res = await request(app)
        .post('/api/user/loginByEmail')
        .send({ email: 'inconnu@test.com', password: 'mauvais' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/user/signup', () => {
    it('devrait rejeter un mot de passe trop court', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send({
          name: 'Test User',
          email: 'newuser@test.com',
          password: '123'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait rejeter un rôle invalide', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send({
          name: 'Test User',
          email: 'newuser@test.com',
          password: '123456',
          role: 'superadmin'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

});