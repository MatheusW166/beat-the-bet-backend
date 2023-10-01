import { faker } from '@faker-js/faker';
import { Participant } from '@prisma/client';
import { prisma } from '@/db';
import { datesToString } from '@test/helpers/convert-dates';
import { CreateParticipantDTO } from '@/dtos';

function create(participant?: Partial<Participant>) {
  return {
    name: faker.person.fullName(),
    balance: faker.number.int({ min: 1000, max: 10000 }),
    ...participant,
  };
}

function createDTO(participant?: Partial<CreateParticipantDTO>) {
  const { name, balance } = create(participant);
  return { name, balance };
}

async function persist(participant?: Partial<Participant>) {
  return prisma.participant.create({
    data: create(participant),
  });
}

async function persistMany(quantity?: number) {
  const length = quantity ?? faker.number.int({ min: 5, max: 40 });
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(createDTO());
  }
  await prisma.participant.createMany({ data });
  const participants = await prisma.participant.findMany({});
  return participants.map((participant) => datesToString(participant));
}

export const participantFactory = { create, createDTO, persist, persistMany };
