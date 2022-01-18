/* eslint-disable no-undef */
import request from 'supertest';
import { app } from '../../app';

it('Return 1 client if it exists ', async () => {
  const res = await request(app).get('/api/clients?name=Joana Amaral');
  expect(res.body.length).toEqual(1);
});

it('Return 0 client if it not exists ', async () => {
  const res = await request(app).get('/api/clients?name=Joana');
  expect(res.body.length).toEqual(0);
});

it('Return an array of clients', async () => {
  const res = await request(app).get('/api/clients?name');

  expect(res.body.length).toBeGreaterThan(0);
});
