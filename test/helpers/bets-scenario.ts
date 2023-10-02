import { Game } from '@prisma/client';
import { betFactory, gameFactory, participantFactory } from '@test/factories';
import { betService } from '@/services';
import { faker } from '@faker-js/faker';

export async function buildGameBetsScenario(game: Game) {
  const winnerParticipants = await participantFactory.persistMany();
  const winnerBets = await betFactory.persistMany({
    game,
    participants: winnerParticipants,
    areWinnerBets: true,
  });
  const loserParticipants = await participantFactory.persistMany();
  const loserBets = await betFactory.persistMany({
    game,
    participants: loserParticipants,
    areWinnerBets: false,
  });

  const resume = betService.gameBetsResume([...winnerBets, ...loserBets], game);

  return {
    game,
    winnerParticipants,
    loserParticipants,
    ...resume,
  };
}

export async function buildValidCreateBetDTO() {
  const participant = await participantFactory.persist();
  const game = await gameFactory.persist({ isFinished: false });
  const createBetDTO = betFactory.createDTO({
    gameId: game.id,
    participantId: participant.id,
    amountBet: validAmountBet(participant.balance),
  });

  return { createBetDTO, game, participant };
}

export async function buildInsufficientBalanceCreateBetDTO() {
  const participant = await participantFactory.persist();
  const game = await gameFactory.persist({ isFinished: false });
  const createBetDTO = betFactory.createDTO({
    gameId: game.id,
    participantId: participant.id,
    amountBet: inValidAmountBet(participant.balance),
  });

  return { createBetDTO, game, participant };
}

export async function buildFinishedGameCreateBetDTO() {
  const participant = await participantFactory.persist();
  const game = await gameFactory.persist({ isFinished: true });
  const createBetDTO = betFactory.createDTO({
    gameId: game.id,
    participantId: participant.id,
    amountBet: validAmountBet(participant.balance),
  });

  return { createBetDTO, game, participant };
}

export async function buildNoParticipantCreateBetDTO() {
  const game = await gameFactory.persist({ isFinished: true });
  const createBetDTO = betFactory.createDTO({
    gameId: game.id,
    participantId: faker.number.int({ min: 1, max: 100 }),
    amountBet: faker.number.int({ min: 1000 }),
  });

  return { createBetDTO, game };
}

export async function buildNoGameCreateBetDTO() {
  const participant = await participantFactory.persist();
  const createBetDTO = betFactory.createDTO({
    gameId: faker.number.int({ min: 1, max: 100 }),
    participantId: participant.id,
    amountBet: validAmountBet(participant.balance),
  });

  return { createBetDTO, participant };
}

function validAmountBet(participantBalance: number) {
  return faker.number.int({ min: 1000, max: participantBalance });
}

function inValidAmountBet(participantBalance: number) {
  return faker.number.int({ min: participantBalance + 1 });
}
