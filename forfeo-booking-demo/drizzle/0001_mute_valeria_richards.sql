CREATE TABLE `availability_slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`time` varchar(5) NOT NULL,
	`capacity` int NOT NULL,
	`booked` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availability_slots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`confirmationNumber` varchar(50) NOT NULL,
	`serviceId` int NOT NULL,
	`slotId` int NOT NULL,
	`customerId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`time` varchar(5) NOT NULL,
	`status` enum('confirmed','completed','cancelled','no_show') DEFAULT 'confirmed',
	`isGift` boolean DEFAULT false,
	`recipientName` varchar(255),
	`recipientEmail` varchar(320),
	`giftMessage` text,
	`specialMessage` text,
	`internalNotes` text,
	`amount` decimal(10,2) NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`paymentStatus` enum('pending','succeeded','failed','refunded') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_confirmationNumber_unique` UNIQUE(`confirmationNumber`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`senderId` int NOT NULL,
	`senderType` enum('customer','company','bot') NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`logo` varchar(512),
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`cancellationPolicy` enum('flexible','moderate','strict','custom') DEFAULT 'flexible',
	`cancellationHours` int DEFAULT 24,
	`cancellationFeePercent` int DEFAULT 50,
	`noShowFeePercent` int DEFAULT 100,
	`maxNoShowsBeforeBlock` int DEFAULT 2,
	`stripeAccountId` varchar(255),
	`stripeOnboardingComplete` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`noShowCount` int DEFAULT 0,
	`isBlocked` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int,
	`type` enum('confirmation','reminder_24h','reminder_2h','cancellation','gift') NOT NULL,
	`recipient` varchar(320) NOT NULL,
	`status` enum('sent','failed') NOT NULL,
	`errorMessage` text,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurring_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`capacity` int DEFAULT 3,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurring_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`bookingId` int,
	`customerId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`ambassadorBadge` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`images` text,
	`included` text,
	`notIncluded` text,
	`ambassadorTested` boolean DEFAULT false,
	`rating` decimal(3,2) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `availability_slots` ADD CONSTRAINT `availability_slots_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_slotId_availability_slots_id_fk` FOREIGN KEY (`slotId`) REFERENCES `availability_slots`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_customerId_customers_id_fk` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_bookingId_bookings_id_fk` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `companies` ADD CONSTRAINT `companies_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_logs` ADD CONSTRAINT `notification_logs_bookingId_bookings_id_fk` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recurring_schedules` ADD CONSTRAINT `recurring_schedules_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_bookingId_bookings_id_fk` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_customerId_customers_id_fk` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `service_idx` ON `availability_slots` (`serviceId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `availability_slots` (`date`);--> statement-breakpoint
CREATE INDEX `unique_slot` ON `availability_slots` (`serviceId`,`date`,`time`);--> statement-breakpoint
CREATE INDEX `service_idx` ON `bookings` (`serviceId`);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `bookings` (`customerId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `bookings` (`date`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `booking_idx` ON `chat_messages` (`bookingId`);--> statement-breakpoint
CREATE INDEX `owner_idx` ON `companies` (`ownerId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `booking_idx` ON `notification_logs` (`bookingId`);--> statement-breakpoint
CREATE INDEX `service_idx` ON `recurring_schedules` (`serviceId`);--> statement-breakpoint
CREATE INDEX `service_idx` ON `reviews` (`serviceId`);--> statement-breakpoint
CREATE INDEX `company_idx` ON `services` (`companyId`);