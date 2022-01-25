import request from 'supertest';
import { app } from '../../app';

it('Return an array of emails ', async () => {
  const res = await request(app).get('/api/emails');
  expect(res.body.length).toBeGreaterThan(0);
});

it('Return an array of items ', async () => {
  const res = await request(app).get('/api/items');
  expect(res.body.length).toBeGreaterThan(0);
});
