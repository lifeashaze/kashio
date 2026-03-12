CREATE TABLE "telegram_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"telegram_user_id" text NOT NULL,
	"telegram_chat_id" text NOT NULL,
	"telegram_username" text,
	"telegram_first_name" text,
	"telegram_last_name" text,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_connections_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "telegram_connections_telegram_user_id_unique" UNIQUE("telegram_user_id"),
	CONSTRAINT "telegram_connections_telegram_chat_id_unique" UNIQUE("telegram_chat_id")
);
--> statement-breakpoint
CREATE TABLE "telegram_link_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_link_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "telegram_pending_confirmations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"telegram_chat_id" text NOT NULL,
	"telegram_message_id" integer,
	"raw_input" text NOT NULL,
	"parsed_expense_json" jsonb NOT NULL,
	"edit_field" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telegram_update_id" text NOT NULL,
	"update_type" text NOT NULL,
	"payload_json" jsonb NOT NULL,
	"status" text NOT NULL,
	"error_message" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_webhook_events_telegram_update_id_unique" UNIQUE("telegram_update_id")
);
--> statement-breakpoint
ALTER TABLE "telegram_connections" ADD CONSTRAINT "telegram_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_link_tokens" ADD CONSTRAINT "telegram_link_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_pending_confirmations" ADD CONSTRAINT "telegram_pending_confirmations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
