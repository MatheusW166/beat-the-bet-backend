import { CreateParticipantDTO } from '@/dtos';
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from '@/errors';
import { participantRepository } from '@/repositories';

const MIN_BALANCE = 1000;

async function create(participant: CreateParticipantDTO) {
  if (participant.balance < MIN_BALANCE) throw new UnprocessableEntityError();
  return participantRepository.create(participant);
}

async function findAll() {
  return participantRepository.findAll();
}

async function findByIdOrThrow(id: number) {
  const participant = await participantRepository.findById(id);
  if (!participant) throw new NotFoundError();
  return participant;
}

async function decrementBalance(id: number, amount: number) {
  const participant = await findByIdOrThrow(id);
  if (amount > participant.balance) throw new ForbiddenError();
  return participantRepository.update(id, {
    balance: participant.balance - amount,
  });
}

async function incrementBalance(id: number, amount: number) {
  const participant = await findByIdOrThrow(id);
  return participantRepository.update(id, {
    balance: participant.balance + amount,
  });
}

export const participantService = {
  create,
  decrementBalance,
  findAll,
  findByIdOrThrow,
  incrementBalance,
};
