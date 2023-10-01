import { responseSchema } from './response.schema';

export const gameSchema = {
  ...responseSchema,
  homeTeamName: expect.any(String),
  awayTeamName: expect.any(String),
  homeTeamScore: expect.any(Number),
  awayTeamScore: expect.any(Number),
  isFinished: expect.any(Boolean),
};
