CREATE TABLE IF NOT EXISTS "nnc-sito-t3_iscrizioni" (
	"id_squadra" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"colore" varchar NOT NULL,
	"cellulare" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_torneo" ADD COLUMN "stato" varchar;