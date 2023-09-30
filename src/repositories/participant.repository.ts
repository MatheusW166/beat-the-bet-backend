import { prisma } from '@/db';
import { CreateParticipantDTO, UpdateParticipantDTO } from '@/dtos';

function findAll() {
  return prisma.participant.findMany({});
}

function create(createParticipantDTO: CreateParticipantDTO) {
  return prisma.participant.create({ data: createParticipantDTO });
}

function findById(id: number) {
  return prisma.participant.findUnique({ where: { id } });
}

function update(id: number, updateParticipantDTO: UpdateParticipantDTO) {
  return prisma.participant.update({
    where: { id },
    data: updateParticipantDTO,
  });
}

export const participantRepository = { findAll, create, findById, update };
