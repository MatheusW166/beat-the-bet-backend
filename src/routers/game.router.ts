import { Router } from 'express';
import { schemaMiddleware } from '@/middlewares';
import { createGameSchema, updateGameSchema } from '@/dtos';
import { gameController } from '@/controllers';

export const gameRouter = Router()
  .post(
    '/',
    schemaMiddleware.validateBody(createGameSchema),
    gameController.create,
  )
  .post(
    '/:gameId/finish',
    schemaMiddleware.validateBody(updateGameSchema),
    gameController.finishGame,
  )
  .get('/:gameId', gameController.findById)
  .get('/', gameController.findAll);
