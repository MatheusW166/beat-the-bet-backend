import { faker } from '@faker-js/faker';
import { Game } from '@prisma/client';
import { prisma } from '@/db';
import { datesToString } from '@test/helpers/convert-dates';
import { CreateGameDTO, UpdateGameDTO } from '@/dtos';

function create(game?: Partial<Game>) {
  return {
    homeTeamName: faker.location.country(),
    awayTeamName: faker.location.country(),
    homeTeamScore: faker.number.int({ min: 0, max: 100 }),
    awayTeamScore: faker.number.int({ min: 0, max: 100 }),
    isFinished: faker.datatype.boolean(),
    ...game,
  };
}

function createDTO(game?: Partial<CreateGameDTO>) {
  const { awayTeamName, homeTeamName } = create(game);
  return { awayTeamName, homeTeamName };
}

function updateDTO(game?: Partial<UpdateGameDTO>) {
  const { awayTeamScore, homeTeamScore } = create(game);
  return { awayTeamScore, homeTeamScore };
}

function persist(game?: Partial<Game>) {
  return prisma.game.create({
    data: create(game),
  });
}

async function persistMany(quantity?: number) {
  const length = quantity ?? faker.number.int({ min: 5, max: 40 });
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(createDTO());
  }
  await prisma.game.createMany({ data });
  const games = await prisma.game.findMany({});
  return games.map((game) => datesToString(game));
}

export const gameFactory = {
  create,
  createDTO,
  updateDTO,
  persist,
  persistMany,
};
