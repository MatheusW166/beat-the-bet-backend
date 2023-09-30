import Joi from 'joi';

export type UpdateGameDTO = {
  homeTeamScore: number;
  awayTeamScore: number;
};

export const updateGameSchema = Joi.object<UpdateGameDTO>({
  homeTeamScore: Joi.number().integer().required(),
  awayTeamScore: Joi.number().integer().required(),
});

export type CreateGameDTO = {
  homeTeamName: string;
  awayTeamName: string;
};

export const createGameSchema = Joi.object<CreateGameDTO>({
  awayTeamName: Joi.string().trim().required(),
  homeTeamName: Joi.string().trim().required(),
});
