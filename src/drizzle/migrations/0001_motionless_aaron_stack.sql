ALTER TABLE "vehicles" ADD COLUMN "images" text;--> statement-breakpoint
ALTER TABLE "vehicle_specifications" DROP COLUMN IF EXISTS "images";