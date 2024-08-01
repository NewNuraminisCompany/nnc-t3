ALTER TABLE "nnc-sito-t3_squadre" DROP CONSTRAINT "nnc-sito-t3_squadre_id_torneo_nnc-sito-t3_torneo_id_torneo_fk";
--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_giocatori" ADD COLUMN "id_squadra" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_giocatori" ADD CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "nnc-sito-t3_squadre" DROP COLUMN IF EXISTS "id_torneo";