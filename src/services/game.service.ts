import { CreateGameDTO, UpdateGameDTO } from '@/dtos';
import { ForbiddenException, NotFoundException } from '@/errors';
import { gameRepository } from '@/repositories';
import { betService } from '.';

async function create(game: CreateGameDTO) {
  return gameRepository.create(game);
}

async function finishGame(id: number, game: UpdateGameDTO) {
  const gameFound = await findByIdOrThrow(id);
  if (gameFound.isFinished) throw new ForbiddenException();
  const updatedGame = await gameRepository.update(id, game, true);
  await betService.finishGameBets(updatedGame);
  return updatedGame;
}

async function findAll() {
  return gameRepository.findAll();
}

async function findByIdOrThrow(id: number) {
  const game = await gameRepository.findById(id);
  if (!game) throw new NotFoundException();
  return game;
}

export const gameService = {
  create,
  findAll,
  finishGame,
  findByIdOrThrow,
};
