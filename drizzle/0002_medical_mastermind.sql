CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"date" timestamp NOT NULL,
	"raw_input" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
