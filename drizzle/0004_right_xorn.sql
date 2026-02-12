CREATE TABLE "user_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"monthly_budget" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"timezone" text DEFAULT 'America/Los_Angeles' NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"date_format" text DEFAULT 'MM/DD/YYYY' NOT NULL,
	"enabled_categories" text[] DEFAULT ARRAY['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'groceries', 'travel', 'education', 'other'] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_step" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;