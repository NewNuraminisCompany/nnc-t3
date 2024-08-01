ALTER TABLE "nnc-sito-t3_squadre" ADD COLUMN "id_torneo" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nnc-sito-t3_squadre" ADD CONSTRAINT "nnc-sito-t3_squadre_id_torneo_nnc-sito-t3_torneo_id_torneo_fk" FOREIGN KEY ("id_torneo") REFERENCES "public"."nnc-sito-t3_torneo"("id_torneo") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
