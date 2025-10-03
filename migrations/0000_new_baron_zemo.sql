CREATE TABLE "home_banners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer NOT NULL,
	"image_url" text NOT NULL,
	"redirect_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_widgets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"position" integer NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"config" text
);
--> statement-breakpoint
CREATE TABLE "huddles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"scheduled_at" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"meals" text[],
	"day" text
);
--> statement-breakpoint
CREATE TABLE "training_videos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"url" text NOT NULL,
	"duration" integer NOT NULL,
	"thumbnail" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weight_room_collections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"exercises" text[],
	"video_ids" text[]
);
