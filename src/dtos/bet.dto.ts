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
  homeTeamScore: Joi.number().integer().greater(-1).required(),
  awayTeamScore: Joi.number().integer().greater(-1).required(),
  amountBet: Joi.number().integer().greater(-1).required(),
  gameId: Joi.number().integer().positive().required(),
  participantId: Joi.number().integer().positive().required(),
});
