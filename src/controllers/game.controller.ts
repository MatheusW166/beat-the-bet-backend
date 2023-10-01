import { Request, Response } from 'express';
import { CreateGameDTO, UpdateGameDTO } from '@/dtos';
import { gameService } from '@/services';
import { validateIdOrThrow } from '@/utils/number.utils';
import httpStatus from 'http-status-codes';

async function create(req: Request, res: Response) {
  const game = req.body as CreateGameDTO;
  res.status(httpStatus.CREATED).send(await gameService.create(game));
}

async function findAll(_req: Request, res: Response) {
  res.send(await gameService.findAll());
}

async function findById(req: Request, res: Response) {
  const id = validateIdOrThrow(req.params.gameId);
  res.send(await gameService.findByIdOrThrow(id));
}

async function finishGame(req: Request, res: Response) {
  const id = validateIdOrThrow(req.params.gameId);
  const game = req.body as UpdateGameDTO;
  res.status(httpStatus.ACCEPTED).send(await gameService.finishGame(id, game));
}

export const gameController = { create, findAll, findById, finishGame };
