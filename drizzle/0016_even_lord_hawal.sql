ALTER TABLE "nnc-sito-t3_giocatori" DROP CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_giocatori" ADD CONSTRAINT "nnc-sito-t3_giocatori_id_squadra_nnc-sito-t3_squadre_id_squadra_fk" FOREIGN KEY ("id_squadra") REFERENCES "public"."nnc-sito-t3_squadre"("id_squadra") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
