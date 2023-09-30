import { prisma } from '@/db';
import { CreateGameDTO, UpdateGameDTO } from '@/dtos';

function findAll() {
  return prisma.game.findMany({});
}

function findById(id: number) {
  return prisma.game.findUnique({
    where: { id },
    include: { Bets: true },
  });
}

function update(id: number, updateGameDTO: UpdateGameDTO, isFinished = false) {
  return prisma.game.update({
    where: { id },
    data: { ...updateGameDTO, isFinished },
  });
}

function create(createGameDTO: CreateGameDTO) {
  return prisma.game.create({ data: createGameDTO });
}

export const gameRepository = { findAll, create, update, findById };
