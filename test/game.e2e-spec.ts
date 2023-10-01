import supertest from 'supertest';
import httpStatus from 'http-status-codes';
import app from '@/app';
import { gameSchema } from './schemas';
import { gameFactory } from './factories';
import { cleanDb } from './helpers';
import { prisma } from '@/db';
import { buildGameBetsScenario } from './helpers/bets-scenario';

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
  });

  describe('GET /games', () => {
    it('Should respond 200 and all games', async () => {
      const games = await gameFactory.persistMany(2);
      const response = await server.get('/games');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining(games));
    });
  });

  describe('POST /games/:id/finish', () => {
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
      expect(await prisma.game.findFirst({})).toMatchObject({
        homeTeamScore: finishedGame.homeTeamScore,
        awayTeamScore: finishedGame.awayTeamScore,
      });
    });

    it('Should respond 202 when game is not finished and update all game bets', async () => {
      const game = await gameFactory.persist({ isFinished: false });

      const { awayTeamScore, homeTeamScore } = game;
      const { winnerBets, loserBets } = await buildGameBetsScenario(game);

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
        include: { Participant: true },
      });
      winnerBetsUpdated.forEach((bet) => {
        expect(bet).toMatchObject({
          status: 'WON',
        });
      });

      const loserBetsUpdated = await prisma.bet.findMany({
        where: { id: { in: loserBets.map((bet) => bet.id) } },
        include: { Participant: true },
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
