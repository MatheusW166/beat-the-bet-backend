import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';
import { gameSchema } from './schemas';
import { gameFactory } from './factories';
import { cleanDb } from './helpers';
import { prisma } from '@/db';
import { buildGameBetsScenario } from './helpers/bets-scenario';
import { betService } from '../src/services';
import { faker } from '@faker-js/faker';

const server = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('GameController (e2e)', () => {
  describe('POST /games', () => {
    it('Should respond 201 and create a game', async () => {
      const game = gameFactory.createDTO();
      const response = await server.post('/games').send(game);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...gameSchema,
        ...game,
      });
    });

    it('Should respond 422 when game is bad formatted', async () => {
      const response = await server.post('/games').send({
        awayTeamName: '',
        homeTeamName: '',
      });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /games', () => {
    it('Should respond 200 and all games', async () => {
      const games = await gameFactory.persistMany(2);
      const response = await server.get('/games');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining(games));
    });
  });

  describe('GET /games/:id', () => {
    it('Should respond 404 when game is not found', async () => {
      const game = await gameFactory.persist();
      const response = await server.get(`/games/${game.id + 1}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond 200 and a game with its bets', async () => {
      const game = await gameFactory.persist({ isFinished: true });
      await buildGameBetsScenario(game);

      const response = await server.get(`/games/${game.id}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        ...game,
        Bets: expect.any(Array),
      });
    });
  });

  describe('POST /games/:id/finish', () => {
    it('Should respond 422 when game is bad formatted', async () => {
      const game = await gameFactory.persist();
      const response = await server.post(`/games/${game.id}/finish`).send({
        homeTeamScore: -1,
        awayTeamScore: -1,
      });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('Should respond 404 when game is not found', async () => {
      const game = gameFactory.updateDTO();
      const response = await server
        .post(`/games/${faker.number.int({ min: 1, max: 100 })}/finish`)
        .send(game);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond 403 when game is already finished', async () => {
      const finishedGame = await gameFactory.persist({ isFinished: true });
      const { homeTeamScore, awayTeamScore } = gameFactory.create();
      const response = await server
        .post(`/games/${finishedGame.id}/finish`)
        .send({
          homeTeamScore: homeTeamScore + 1,
          awayTeamScore: awayTeamScore + 1,
        });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
      const updatedGame = await prisma.game.findUnique({
        where: { id: finishedGame.id },
      });
      expect(updatedGame).toMatchObject({
        homeTeamScore: finishedGame.homeTeamScore,
        awayTeamScore: finishedGame.awayTeamScore,
      });
    });

    it('Should respond 202 and update all game bets', async () => {
      const game = await gameFactory.persist({ isFinished: false });

      const { awayTeamScore, homeTeamScore } = game;
      const { winnerBets, loserBets, winnersAmount, betsAmount } =
        await buildGameBetsScenario(game);

      const response = await server.post(`/games/${game.id}/finish`).send({
        awayTeamScore,
        homeTeamScore,
      });

      expect(response.status).toBe(httpStatus.ACCEPTED);
      expect(response.body).toMatchObject({
        awayTeamScore,
        homeTeamScore,
        isFinished: true,
      });

      const winnerBetsUpdated = await prisma.bet.findMany({
        where: { id: { in: winnerBets.map((bet) => bet.id) } },
      });
      winnerBetsUpdated.forEach((bet) => {
        const oldBet = winnerBets.find(({ id }) => bet.id === id);
        expect(bet).toMatchObject({
          status: 'WON',
          amountWon: betService.calcAmountWon(
            oldBet!.amountBet,
            winnersAmount,
            betsAmount,
          ),
        });
      });

      const loserBetsUpdated = await prisma.bet.findMany({
        where: { id: { in: loserBets.map((bet) => bet.id) } },
      });
      loserBetsUpdated.forEach((bet) => {
        expect(bet).toMatchObject({
          status: 'LOST',
          amountWon: 0,
        });
      });
    });
  });
});
