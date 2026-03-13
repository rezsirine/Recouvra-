const request = require('supertest');
const app     = require('../app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/user/loginByEmail')
    .send({ email: 'yasmine@test.com', password: '123456' });
  token = res.body.token;
});

describe('Recovery API', () => {

  describe('POST /api/recovery/create', () => {
    it('devrait rejeter un type invalide', async () => {
      const res = await request(app)
        .post('/api/recovery/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          invoiceId: '000000000000000000000001',
          type: 'invalid_type',
          description: 'Test description'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait rejeter si description manquante', async () => {
      const res = await request(app)
        .post('/api/recovery/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          invoiceId: '000000000000000000000001',
          type: 'call'
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Données invalides');
    });
  });

  describe('GET /api/recovery/getAll', () => {
    it('devrait retourner la liste des actions', async () => {
      const res = await request(app)
        .get('/api/recovery/getAll')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app).get('/api/recovery/getAll');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/recovery/stats', () => {
    it('devrait retourner les statistiques de recouvrement', async () => {
      const res = await request(app)
        .get('/api/recovery/stats')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBeDefined();
      expect(res.body.byOutcome).toBeDefined();
    });
  });

});