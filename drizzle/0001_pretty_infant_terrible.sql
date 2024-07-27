CREATE TABLE IF NOT EXISTS "nnc-sito-t3_avvenimento" (
	"tipo" varchar NOT NULL,
	"minuto" integer NOT NULL,
	CONSTRAINT "nnc-sito-t3_avvenimento_tipo_minuto_pk" PRIMARY KEY("tipo","minuto")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_gap" (
	"cf" varchar NOT NULL,
	"minuto" integer NOT NULL,
	"tipo" varchar NOT NULL,
	"id_partita" varchar NOT NULL,
	CONSTRAINT "nnc-sito-t3_gap_cf_minuto_tipo_id_partita_pk" PRIMARY KEY("cf","minuto","tipo","id_partita")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_giocatori" (
	"cf" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"cognome" varchar NOT NULL,
	"data_nascita" date NOT NULL,
	"id_squadra" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_partite" (
	"id_partita" varchar PRIMARY KEY NOT NULL,
	"id_squadra1" varchar NOT NULL,
	"id_squadra2" varchar NOT NULL,
	"risultato_squadra1" integer NOT NULL,
	"risultato_squadra2" integer NOT NULL,
	"data_ora" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_squadre" (
	"id_squadra" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"colore" varchar NOT NULL,
	"cellulare" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_torneo" (
	"id_torneo" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"descrizione" varchar NOT NULL,
	"data_inizio" date NOT NULL,
	"data_fine" date NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_gap" ADD CONSTRAINT "nnc-sito-t3_gap_cf_nnc-sito-t3_giocatori_cf_fk" FOREIGN KEY ("cf") REFERENCES "public"."nnc-sito-t3_giocatori"("cf") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_gap" ADD CONSTRAINT "nnc-sito-t3_gap_id_partita_nnc-sito-t3_partite_id_partita_fk" FOREIGN KEY ("id_partita") REFERENCES "public"."nnc-sito-t3_partite"("id_partita") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_giocatori" ADD CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_partite" ADD CONSTRAINT "nnc-sito-t3_partite_id_squadra1_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra1") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_partite" ADD CONSTRAINT "nnc-sito-t3_partite_id_squadra2_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra2") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
