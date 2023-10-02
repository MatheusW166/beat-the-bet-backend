import { CreateBetDTO } from '@/dtos';
import { gameService, participantService } from '@/services';
import { ForbiddenException } from '@/errors';
import { betRepository } from '@/repositories';
import { Bet, Game } from '@prisma/client';

const HOME_TAX = 0.3;

async function create(bet: CreateBetDTO) {
  const { participantId, gameId } = bet;

  const participant = await participantService.findByIdOrThrow(participantId);
  if (bet.amountBet > participant.balance) throw new ForbiddenException();

  const game = await gameService.findByIdOrThrow(gameId);
  if (game.isFinished) throw new ForbiddenException();

  await participantService.decrementBalance(participantId, bet.amountBet);
  return betRepository.create(bet);
}

function filterWinnerBets(bets: Bet[], game: Game) {
  const { awayTeamScore, homeTeamScore } = game;
  return bets.filter(
    (bet) =>
      bet.awayTeamScore === awayTeamScore &&
      bet.homeTeamScore === homeTeamScore,
  );
}

function filterLoserBets(bets: Bet[], game: Game) {
  const { awayTeamScore, homeTeamScore } = game;
  return bets.filter(
    (bet) =>
      bet.awayTeamScore !== awayTeamScore ||
      bet.homeTeamScore !== homeTeamScore,
  );
}

function sumAmountBets(bets: Bet[]) {
  return bets.reduce((prev, curr) => prev + curr.amountBet, 0);
}

function calcAmountWon(
  amountBet: number,
  winnersAmount: number,
  betsAmount: number,
) {
  const tax = 1 - HOME_TAX;
  return Math.floor((amountBet / winnersAmount) * betsAmount * tax);
}

async function updateLoserBet(id: number) {
  return betRepository.update(id, { amountWon: 0, status: 'LOST' });
}

async function updateWinnerBet(
  id: number,
  participantId: number,
  amountWon: number,
) {
  await participantService.incrementBalance(participantId, amountWon);
  return betRepository.update(id, { amountWon, status: 'WON' });
}

function gameBetsResume(bets: Bet[], game: Game) {
  const betsAmount = sumAmountBets(bets);
  const loserBets = filterLoserBets(bets, game);
  const winnerBets = filterWinnerBets(bets, game);
  const winnersAmount = sumAmountBets(winnerBets);

  return {
    betsAmount,
    loserBets,
    winnerBets,
    winnersAmount,
  };
}

async function finishGameBets(gameId: number) {
  const game = await gameService.findByIdOrThrow(gameId);
  const bets = await betRepository.findByGameId(gameId);

  const { betsAmount, loserBets, winnerBets, winnersAmount } = gameBetsResume(
    bets,
    game,
  );

  const promises: Promise<Bet>[] = [];

  loserBets.forEach((bet) => promises.push(updateLoserBet(bet.id)));
  winnerBets.forEach((bet) => {
    const amountWon = calcAmountWon(bet.amountBet, winnersAmount, betsAmount);
    promises.push(updateWinnerBet(bet.id, bet.participantId, amountWon));
  });

  return Promise.all(promises);
}

export const betService = {
  create,
  finishGameBets,
  gameBetsResume,
  calcAmountWon,
};
