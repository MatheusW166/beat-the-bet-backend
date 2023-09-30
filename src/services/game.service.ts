import { CreateGameDTO, UpdateGameDTO } from '@/dtos';
import { ForbiddenError, NotFoundError } from '@/errors';
import { gameRepository } from '@/repositories';
import { betService } from '.';

async function create(game: CreateGameDTO) {
  return gameRepository.create(game);
}

async function finishGame(id: number, game: UpdateGameDTO) {
  const gameFound = await findByIdOrThrow(id);
  if (gameFound.isFinished) throw new ForbiddenError();
  await betService.finishGameBets(id);
  return gameRepository.update(id, game, true);
}

async function findAll() {
  return gameRepository.findAll();
}

async function findByIdOrThrow(id: number) {
  const game = await gameRepository.findById(id);
  if (!game) throw new NotFoundError();
  return game;
}

export const gameService = {
  create,
  findAll,
  finishGame,
  findByIdOrThrow,
};
