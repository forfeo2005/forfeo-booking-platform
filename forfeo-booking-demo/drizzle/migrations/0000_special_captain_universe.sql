CREATE TABLE `availability_slots` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`is_booked` boolean NOT NULL DEFAULT false,
	CONSTRAINT `availability_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`service_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`slot_id` int,
	`status` varchar(50) NOT NULL DEFAULT 'CONFIRMED',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`booking_id` int NOT NULL,
	`sender_id` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`org_id` int NOT NULL,
	`role` varchar(50) DEFAULT 'MEMBER',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`payload` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notification_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurring_schedules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`day_of_week` int NOT NULL,
	`start_hour` int NOT NULL,
	`end_hour` int NOT NULL,
	CONSTRAINT `recurring_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`org_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`duration_minutes` int NOT NULL,
	`price_cents` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`active_org_id` int,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(255),
	`role` varchar(50) DEFAULT 'USER',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `booking_org_idx` ON `bookings` (`org_id`);--> statement-breakpoint
CREATE INDEX `customer_org_idx` ON `customers` (`org_id`);--> statement-breakpoint
CREATE INDEX `user_org_idx` ON `memberships` (`user_id`,`org_id`);--> statement-breakpoint
CREATE INDEX `service_org_idx` ON `services` (`org_id`);