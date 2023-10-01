import { faker } from '@faker-js/faker';
import { Bet, BetStatus, Game, Participant } from '@prisma/client';
import { prisma } from '@/db';
import { CreateBetDTO } from '@/dtos';
import { datesToString } from '@test/helpers/convert-dates';

type CreateBetReturn = {
  id?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  homeTeamScore: number;
  awayTeamScore: number;
  amountBet: number;
  gameId: number;
  participantId: number;
  status: BetStatus;
  amountWon: number | null;
};

function create(bet?: Partial<Bet>) {
  return {
    homeTeamScore: faker.number.int({ min: 0, max: 100 }),
    awayTeamScore: faker.number.int({ min: 0, max: 100 }),
    amountBet: faker.number.int({ min: 1000, max: 10000 }),
    status: faker.helpers.enumValue(BetStatus),
    amountWon: faker.number.int({ min: 1000, max: 10000 }),
    gameId: faker.number.int({ min: 0, max: 100 }),
    participantId: faker.number.int({ min: 0, max: 100 }),
    ...bet,
  };
}

function createDTO(bet?: Partial<CreateBetDTO>) {
  const { homeTeamScore, awayTeamScore, amountBet, gameId, participantId } =
    create(bet);
  return {
    homeTeamScore,
    awayTeamScore,
    amountBet,
    gameId,
    participantId,
  };
}

function winnerScore(game: Game) {
  return {
    awayTeamScore: game.awayTeamScore,
    homeTeamScore: game.homeTeamScore,
  };
}

function loserScore(game: Game) {
  const loser = {
    awayTeamScore: game.awayTeamScore + 1,
    homeTeamScore: game.homeTeamScore + 1,
  };
  return loser;
}

type PersistManyProps = {
  participants: Participant[];
  game: Game;
  areWinnerBets: boolean;
};

async function persistMany({
  participants,
  game,
  areWinnerBets = false,
}: PersistManyProps) {
  const data: CreateBetReturn[] = [];
  const score = areWinnerBets ? winnerScore(game) : loserScore(game);
  participants.forEach((participant) => {
    const bet = create({
      gameId: game.id,
      participantId: participant.id,
      status: 'PENDING',
      amountWon: null,
      ...score,
    });
    data.push(bet);
  });
  const bets = await prisma.bet.findMany({ where: { ...score } });
  return bets.map((bet) => datesToString(bet));
}

function persist(bet?: Partial<Bet>) {
  return prisma.bet.create({
    data: createDTO(bet),
  });
}

export const betFactory = {
  create,
  createDTO,
  persistMany,
  persist,
};
