DROP TABLE `availability_slots`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
DROP TABLE `chat_messages`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
DROP TABLE `memberships`;--> statement-breakpoint
DROP TABLE `notification_logs`;--> statement-breakpoint
DROP TABLE `recurring_schedules`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `email_idx`;--> statement-breakpoint
DROP INDEX `service_org_idx` ON `services`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `price` int NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `duration` int NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `organization_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `organization_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `organizations` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `organizations` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `org_id`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `title`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `duration_minutes`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `price_cents`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password_hash`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `updated_at`;