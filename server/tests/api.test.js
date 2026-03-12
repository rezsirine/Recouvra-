const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let token;
let clientId;
let invoiceId;
let actionId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recouvraplus_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

// ─── USER ───────────────────────────────────────────
describe('Users', () => {
  test('POST /api/user/signup — crée un utilisateur', async () => {
    const res = await request(app).post('/api/user/signup').send({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'test123',
      role: 'admin'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('POST /api/user/loginByEmail — connexion valide', async () => {
    const res = await request(app).post('/api/user/loginByEmail').send({
      email: 'admin@test.com',
      password: 'test123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('POST /api/user/loginByEmail — mauvais mot de passe', async () => {
    const res = await request(app).post('/api/user/loginByEmail').send({
      email: 'admin@test.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/user/me — retourne le profil', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'admin@test.com');
  });

  test('GET /api/user/me — sans token → 401', async () => {
    const res = await request(app).get('/api/user/me');
    expect(res.statusCode).toBe(401);
  });
});

// ─── CLIENTS ────────────────────────────────────────
describe('Clients', () => {
  test('POST /api/client/create — crée un client', async () => {
    const res = await request(app)
      .post('/api/client/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jean Martin',
        email: 'jean@martin.fr',
        phone: '0612345678',
        company: 'Martin SARL',
        siret: '12345678901234',
        address: '1 rue Test, Paris'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.client).toHaveProperty('siret', '12345678901234');
    clientId = res.body.client._id;
  });

  test('POST /api/client/create — SIRET dupliqué', async () => {
    const res = await request(app)
      .post('/api/client/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Autre Nom',
        email: 'autre@test.fr',
        phone: '0600000000',
        company: 'Autre SARL',
        siret: '12345678901234',
        address: 'Autre adresse'
      });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/client/getAll — liste les clients', async () => {
    const res = await request(app)
      .get('/api/client/getAll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/client/get/:id — récupère un client', async () => {
    const res = await request(app)
      .get(`/api/client/get/${clientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(clientId);
  });

  test('PUT /api/client/update/:id — modifie un client', async () => {
    const res = await request(app)
      .put(`/api/client/update/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jean Martin Modifié' });
    expect(res.statusCode).toBe(200);
    expect(res.body.client.name).toBe('Jean Martin Modifié');
  });
});

// ─── INVOICES ───────────────────────────────────────
describe('Invoices', () => {
  test('POST /api/invoice/create — crée une facture', async () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const res = await request(app)
      .post('/api/invoice/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: 'FAC-TEST-001',
        amount: 1500,
        dueDate: dueDate.toISOString(),
        clientId,
        description: 'Facture test'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.invoice.number).toBe('FAC-TEST-001');
    invoiceId = res.body.invoice._id;
  });

  test('POST /api/invoice/create — numéro dupliqué', async () => {
    const res = await request(app)
      .post('/api/invoice/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        number: 'FAC-TEST-001',
        amount: 500,
        dueDate: new Date().toISOString(),
        clientId
      });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/invoice/getAll — liste les factures', async () => {
    const res = await request(app)
      .get('/api/invoice/getAll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/invoice/stats — retourne les statistiques', async () => {
    const res = await request(app)
      .get('/api/invoice/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalAmount');
  });

  test('POST /api/invoice/payment/:id — enregistre un paiement', async () => {
    const res = await request(app)
      .post(`/api/invoice/payment/${invoiceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500 });
    expect(res.statusCode).toBe(200);
    expect(res.body.invoice.paidAmount).toBe(500);
    expect(res.body.invoice.status).toBe('pending');
  });

  test('POST /api/invoice/payment/:id — paiement complet → status paid', async () => {
    const res = await request(app)
      .post(`/api/invoice/payment/${invoiceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.invoice.status).toBe('paid');
  });
});

// ─── RECOVERY ───────────────────────────────────────
describe('Recovery Actions', () => {
  test('POST /api/recovery/create — crée une action', async () => {
    const res = await request(app)
      .post('/api/recovery/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        invoiceId,
        type: 'call',
        description: 'Appel de relance test',
        date: new Date().toISOString()
      });
    expect(res.statusCode).toBe(201);
    actionId = res.body.action._id;
  });

  test('GET /api/recovery/getAll — liste les actions', async () => {
    const res = await request(app)
      .get('/api/recovery/getAll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/recovery/stats — retourne les statistiques', async () => {
    const res = await request(app)
      .get('/api/recovery/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
  });

  test('PUT /api/recovery/update/:id — modifie une action', async () => {
    const res = await request(app)
      .put(`/api/recovery/update/${actionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ outcome: 'successful' });
    expect(res.statusCode).toBe(200);
    expect(res.body.action.outcome).toBe('successful');
  });

  test('DELETE /api/recovery/delete/:id — supprime une action', async () => {
    const res = await request(app)
      .delete(`/api/recovery/delete/${actionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

// ─── CLEANUP ────────────────────────────────────────
describe('Cleanup', () => {
  test('DELETE client avec factures → 400', async () => {
    const res = await request(app)
      .delete(`/api/client/delete/${clientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
  });
});
