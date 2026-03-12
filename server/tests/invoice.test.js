const request = require('supertest');
const express = require('express');

const mockInvoice = {
  _id: 'inv123',
  number: 'FAC-001',
  amount: 1500,
  paidAmount: 0,
  dueDate: new Date('2025-12-31'),
  status: 'unpaid',
  client: { _id: 'cli123', name: 'ACME', company: 'ACME Corp' },
  save: jest.fn().mockResolvedValue(true),
};

jest.mock('../model/invoice', () => ({
  find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }),
  findById: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(null) }),
  findOne: jest.fn().mockResolvedValue(null),
  findByIdAndUpdate: jest.fn().mockResolvedValue(null),
  findByIdAndDelete: jest.fn().mockResolvedValue(null),
  countDocuments: jest.fn().mockResolvedValue(0),
  create: jest.fn().mockResolvedValue({ _id: 'inv_new', number: 'FAC-NEW' }),
}));

jest.mock('../model/client', () => ({
  findById: jest.fn().mockResolvedValue({ _id: 'cli123', name: 'ACME' }),
}));

jest.mock('../model/recoveryAction', () => ({
  countDocuments: jest.fn().mockResolvedValue(0),
}));

const app = express();
app.use(express.json());
const invoiceRoutes = require('../routes/invoice.routes');
app.use('/api/invoice', invoiceRoutes);

describe('Invoice Routes', () => {
  test('GET /api/invoice/stats - devrait retourner les statistiques', async () => {
    const Invoice = require('../model/invoice');
    Invoice.find.mockResolvedValue([{ amount: 1000, paidAmount: 500 }]);
    Invoice.countDocuments.mockResolvedValue(5);
    const res = await request(app).get('/api/invoice/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
  });

  test('GET /api/invoice/getAll - devrait retourner la liste', async () => {
    const Invoice = require('../model/invoice');
    Invoice.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([mockInvoice]) })
    });
    const res = await request(app).get('/api/invoice/getAll');
    expect(res.status).toBe(200);
  });

  test('GET /api/invoice/overdue - retourne les factures en retard', async () => {
    const Invoice = require('../model/invoice');
    Invoice.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([mockInvoice])
    });
    const res = await request(app).get('/api/invoice/overdue');
    expect(res.status).toBe(200);
  });

  test('DELETE /api/invoice/delete/:id - impossible si actions liées', async () => {
    const RecoveryAction = require('../model/recoveryAction');
    RecoveryAction.countDocuments.mockResolvedValue(2);
    const res = await request(app).delete('/api/invoice/delete/inv123');
    expect(res.status).toBe(400);
  });
});
