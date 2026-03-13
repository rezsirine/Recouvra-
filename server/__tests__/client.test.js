const request = require('supertest');
const app     = require('../app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/user/loginByEmail')
    .send({ email: 'yasmine@test.com', password: '123456' });
  token = res.body.token;
});

describe('Client API', () => {

  describe('POST /api/client/create', () => {
    it('devrait rejeter un SIRET invalide', async () => {
      const res = await request(app)
        .post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Client',
          company: 'Test SARL',
          email: 'test@test.com',
          phone: '0600000000',
          siret: '123',
          address: '1 rue de Paris'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait rejeter un email invalide', async () => {
      const res = await request(app)
        .post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Client',
          company: 'Test SARL',
          email: 'pas-un-email',
          phone: '0600000000',
          siret: '12345678901234',
          address: '1 rue de Paris'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Email invalide');
    });

    it('devrait rejeter si champs requis manquants', async () => {
      const res = await request(app)
        .post('/api/client/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Données invalides');
    });
  });

  describe('GET /api/client/getAll', () => {
    it('devrait retourner la liste des clients', async () => {
      const res = await request(app)
        .get('/api/client/getAll')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app).get('/api/client/getAll');
      expect(res.status).toBe(401);
    });
  });

});