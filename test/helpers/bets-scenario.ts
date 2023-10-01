import { Game } from '@prisma/client';
import { betFactory, participantFactory } from '@test/factories';

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

  return { winnerParticipants, winnerBets, loserParticipants, loserBets };
}
