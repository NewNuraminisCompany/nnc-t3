ALTER TABLE "nnc-sito-t3_giocatori" DROP CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk";
--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_giocatori" DROP COLUMN IF EXISTS "id_squadra";