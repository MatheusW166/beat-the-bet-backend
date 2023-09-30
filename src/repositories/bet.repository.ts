import { prisma } from '@/db';
import { CreateBetDTO, UpdateBetDTO } from '@/dtos';

function create(bet: CreateBetDTO) {
  return prisma.bet.create({ data: bet });
}

function update(id: number, bet: UpdateBetDTO) {
  return prisma.bet.update({ where: { id }, data: bet });
}

function findByGameId(gameId: number) {
  return prisma.bet.findMany({ where: { gameId } });
}

export const betRepository = { create, update, findByGameId };
