import { Calculator } from './calculator';
import request from 'supertest';
import app from './server';

describe('Calculator Logic', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(Calculator.add(1, 2)).toBe(3);
  });
  test('subtracts 5 - 2 to equal 3', () => {
    expect(Calculator.subtract(5, 2)).toBe(3);
  });
  test('multiplies 2 * 3 to equal 6', () => {
    expect(Calculator.multiply(2, 3)).toBe(6);
  });
  test('divides 6 / 2 to equal 3', () => {
    expect(Calculator.divide(6, 2)).toBe(3);
  });
  test('throws error on division by zero', () => {
    expect(() => Calculator.divide(1, 0)).toThrow("Division by zero");
  });
});

describe('Calculator API', () => {
  test('POST /calculate - addition', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, b: 5, operation: 'add' });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(15);
  });

  test('POST /calculate - division by zero', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, b: 0, operation: 'divide' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Division by zero');
  });

  test('POST /calculate - missing parameters', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, operation: 'add' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing parameters');
  });

  test('POST /calculate - unknown operation', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, b: 5, operation: 'modulus' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Unknown operation');
  });
});
