/*
  Warnings:

  - You are about to alter the column `amountWon` on the `bets` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `balance` on the `participants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "bets" ALTER COLUMN "amountWon" DROP NOT NULL,
ALTER COLUMN "amountWon" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "participants" ALTER COLUMN "balance" SET DATA TYPE INTEGER;
