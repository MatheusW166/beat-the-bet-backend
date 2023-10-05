import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';
import { cleanDb } from './helpers';
import {
  buildFinishedGameCreateBetDTO,
  buildInsufficientBalanceCreateBetDTO,
  buildNoGameCreateBetDTO,
  buildNoParticipantCreateBetDTO,
  buildValidCreateBetDTO,
} from './helpers/bets-scenario';
import { prisma } from '../src/db';
import { betFactory } from './factories';

const server = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('BetController (e2e)', () => {
  describe('POST /bets', () => {
    it('Should respond 422 when bet is bad formatted', async () => {
      const createBetDTO = betFactory.createDTO({ amountBet: -1 });

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('Should respond 404 when participant does not exist', async () => {
      const { createBetDTO } = await buildNoParticipantCreateBetDTO();

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.NOT_FOUND);

      const betFound = await prisma.bet.findFirst();
      expect(betFound).toBeNull();
    });

    it('Should respond 404 when game does not exist', async () => {
      const { createBetDTO } = await buildNoGameCreateBetDTO();

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.NOT_FOUND);

      const betFound = await prisma.bet.findFirst();
      expect(betFound).toBeNull();
    });

    it('Should respond 403 when participant has insuficient balance', async () => {
      const { createBetDTO, participant } =
        await buildInsufficientBalanceCreateBetDTO();

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.FORBIDDEN);

      const betFound = await prisma.bet.findFirst();
      expect(betFound).toBeNull();

      const updatedParticipant = await prisma.participant.findFirst();
      expect(updatedParticipant!.balance).toEqual(participant.balance);
    });

    it('Should respond 403 when game is finished', async () => {
      const { createBetDTO, participant } =
        await buildFinishedGameCreateBetDTO();

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.FORBIDDEN);

      const betFound = await prisma.bet.findFirst();
      expect(betFound).toBeNull();

      const updatedParticipant = await prisma.participant.findFirst();
      expect(updatedParticipant!.balance).toEqual(participant.balance);
    });

    it('Should respond 201 and create a bet', async () => {
      const { createBetDTO, participant } = await buildValidCreateBetDTO();

      const response = await server.post('/bets').send(createBetDTO);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toMatchObject(createBetDTO);

      const updatedParticipant = await prisma.participant.findFirst();
      expect(updatedParticipant!.balance).toBeGreaterThanOrEqual(0);
      expect(updatedParticipant!.balance).toEqual(
        participant.balance - createBetDTO.amountBet,
      );
    });
  });
});
