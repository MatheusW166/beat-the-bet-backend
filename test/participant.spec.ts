import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';
import { responseSchema } from './schemas';
import { participantFactory } from './factories';
import { cleanDb } from './helpers';
import { prisma } from '../src/db';

const server = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('ParticipantController (e2e)', () => {
  describe('POST /participants', () => {
    it('Should respond 201 and create a participant', async () => {
      const participant = participantFactory.createDTO();
      const response = await server.post('/participants').send(participant);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...responseSchema,
        name: participant.name,
        balance: participant.balance,
      });
    });

    it('Should respond 403 when balance is less than 1000', async () => {
      const participant = participantFactory.create({ balance: 100 });
      const response = await server.post('/participants').send(participant);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
      expect(await prisma.participant.findMany({})).toHaveLength(0);
    });
  });

  describe('GET /participants', () => {
    it('Should respond 200 and all participants', async () => {
      const participants = await participantFactory.persistMany();
      const response = await server.get('/participants');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining(participants));
    });
  });
});
