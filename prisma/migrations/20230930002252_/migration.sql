-- AlterTable
CREATE SEQUENCE bets_id_seq;
ALTER TABLE "bets" ALTER COLUMN "id" SET DEFAULT nextval('bets_id_seq');
ALTER SEQUENCE bets_id_seq OWNED BY "bets"."id";

-- AlterTable
CREATE SEQUENCE games_id_seq;
ALTER TABLE "games" ALTER COLUMN "id" SET DEFAULT nextval('games_id_seq');
ALTER SEQUENCE games_id_seq OWNED BY "games"."id";

-- AlterTable
CREATE SEQUENCE participants_id_seq;
ALTER TABLE "participants" ALTER COLUMN "id" SET DEFAULT nextval('participants_id_seq');
ALTER SEQUENCE participants_id_seq OWNED BY "participants"."id";
