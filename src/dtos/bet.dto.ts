import { BetStatus } from '@prisma/client';
import Joi from 'joi';

export type UpdateBetDTO = {
  status: BetStatus;
  amountWon: number;
};

export type CreateBetDTO = {
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
};

export const createBetSchema = Joi.object<CreateBetDTO>({
  homeTeamScore: Joi.number().integer().required(),
  awayTeamScore: Joi.number().integer().required(),
  amountBet: Joi.number().integer().required(),
  gameId: Joi.number().integer().required(),
  participantId: Joi.number().integer().required(),
});
