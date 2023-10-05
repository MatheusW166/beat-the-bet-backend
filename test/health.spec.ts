import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';

const server = supertest(app);

describe('GET /health', () => {
  it('Should respond OK', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toBe('OK');
  });
});
