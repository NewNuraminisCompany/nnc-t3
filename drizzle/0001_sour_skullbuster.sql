ALTER TABLE "nnc-sito-t3_partite" ADD COLUMN "data_ora" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_partite" DROP COLUMN IF EXISTS "ora";--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_partite" DROP COLUMN IF EXISTS "data";