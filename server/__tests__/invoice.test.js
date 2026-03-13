const request = require('supertest');
const app     = require('../app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/user/loginByEmail')
    .send({ email: 'yasmine@test.com', password: '123456' });
  token = res.body.token;
});

describe('Invoice API', () => {

  describe('POST /api/invoice/create', () => {
    it('devrait rejeter un montant négatif', async () => {
      const res = await request(app)
        .post('/api/invoice/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          number: 'FAC-001',
          amount: -100,
          dueDate: '2027-01-01',
          clientId: '000000000000000000000001'
        });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait rejeter si clientId manquant', async () => {
      const res = await request(app)
        .post('/api/invoice/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          number: 'FAC-002',
          amount: 1000,
          dueDate: '2027-01-01'
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Données invalides');
    });
  });

  describe('POST /api/invoice/payment/:id', () => {
    it('devrait rejeter un paiement négatif', async () => {
      const res = await request(app)
        .post('/api/invoice/payment/000000000000000000000001')
        .set('Authorization', `Bearer ${token}`)
        .send({ amount: -50 });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/invoice/getAll', () => {
    it('devrait retourner la liste des factures', async () => {
      const res = await request(app)
        .get('/api/invoice/getAll')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('devrait rejeter sans token', async () => {
      const res = await request(app).get('/api/invoice/getAll');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/invoice/stats', () => {
    it('devrait retourner les statistiques', async () => {
      const res = await request(app)
        .get('/api/invoice/stats')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBeDefined();
    });
  });

});