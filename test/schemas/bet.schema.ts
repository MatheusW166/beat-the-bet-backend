import { responseSchema } from './response.schema';

export const betSchema = {
  ...responseSchema,
  homeTeamScore: expect.any(Number),
  awayTeamScore: expect.any(Number),
  amountBet: expect.any(Number),
  gameId: expect.any(Number),
  participantId: expect.any(Number),
  status: expect.any(String),
  amountWon: expect.any(null),
};
