import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';
import { betSchema } from './schemas';
import { betFactory } from './factories';
import { cleanDb } from './helpers';

const server = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('BetController (e2e)', () => {
  describe('POST /bets', () => {
    it('Should respond 201 and create a bet', async () => {
      const bet = betFactory.createDTO();
      const response = await server.post('/bets').send(bet);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...betSchema,
        ...bet,
      });
    });

    it('Should respond 403 when participant has insuficient balance', async () => {
      const bet = betFactory.createDTO();
      const response = await server.post('/bets').send(bet);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...betSchema,
        ...bet,
      });
    });

    it('Should respond 403 when bet is finished', async () => {
      const bet = betFactory.createDTO();
      const response = await server.post('/bets').send(bet);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...betSchema,
        ...bet,
      });
    });
  });
});
