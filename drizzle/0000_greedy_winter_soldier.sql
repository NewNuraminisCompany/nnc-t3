CREATE TABLE IF NOT EXISTS "nnc-sito-t3_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "nnc-sito-t3_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_avvenimento" (
	"tipo" varchar NOT NULL,
	"minuto" integer NOT NULL,
	CONSTRAINT "nnc-sito-t3_avvenimento_tipo_minuto_pk" PRIMARY KEY("tipo","minuto")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_gap" (
	"id_giocatore" varchar NOT NULL,
	"minuto" integer NOT NULL,
	"tipo" varchar NOT NULL,
	"id_partita" varchar NOT NULL,
	CONSTRAINT "nnc-sito-t3_gap_id_giocatore_minuto_tipo_id_partita_pk" PRIMARY KEY("id_giocatore","minuto","tipo","id_partita")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_giocatori" (
	"id_giocatore" varchar PRIMARY KEY NOT NULL,
	"cf" varchar NOT NULL,
	"nome" varchar NOT NULL,
	"cognome" varchar NOT NULL,
	"data_nascita" date NOT NULL,
	"id_squadra" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_gironi" (
	"id_girone" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"id_squadra" varchar,
	"id_partita" varchar
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
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_squadre" (
	"id_squadra" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"colore" varchar NOT NULL,
	"cellulare" varchar(11) NOT NULL,
	"statoAccettazione" boolean,
	"id_torneo" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_torneo" (
	"id_torneo" varchar PRIMARY KEY NOT NULL,
	"nome" varchar NOT NULL,
	"descrizione" varchar NOT NULL,
	"data_inizio" date NOT NULL,
	"data_fine" date NOT NULL,
	"stato" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nnc-sito-t3_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "nnc-sito-t3_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_account" ADD CONSTRAINT "nnc-sito-t3_account_user_id_nnc-sito-t3_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nnc-sito-t3_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_gap" ADD CONSTRAINT "nnc-sito-t3_gap_id_giocatore_nnc-sito-t3_giocatori_id_giocatore_fk" FOREIGN KEY ("id_giocatore") REFERENCES "public"."nnc-sito-t3_giocatori"("id_giocatore") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "nnc-sito-t3_giocatori" ADD CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_gironi" ADD CONSTRAINT "nnc-sito-t3_gironi_id_squadra_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_gironi" ADD CONSTRAINT "nnc-sito-t3_gironi_id_partita_nnc-sito-t3_partite_id_partita_fk" FOREIGN KEY ("id_partita") REFERENCES "public"."nnc-sito-t3_partite"("id_partita") ON DELETE no action ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_post" ADD CONSTRAINT "nnc-sito-t3_post_created_by_nnc-sito-t3_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."nnc-sito-t3_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_session" ADD CONSTRAINT "nnc-sito-t3_session_user_id_nnc-sito-t3_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."nnc-sito-t3_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_squadre" ADD CONSTRAINT "nnc-sito-t3_squadre_id_torneo_nnc-sito-t3_torneo_id_torneo_fk" FOREIGN KEY ("id_torneo") REFERENCES "public"."nnc-sito-t3_torneo"("id_torneo") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "nnc-sito-t3_account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "nnc-sito-t3_post" ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "nnc-sito-t3_post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "nnc-sito-t3_session" ("user_id");