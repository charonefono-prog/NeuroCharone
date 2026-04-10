CREATE TABLE `access_control` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`passwordHash` varchar(255),
	`isApproved` boolean NOT NULL DEFAULT false,
	`helmetSerialNumber` varchar(100),
	`helmetModel` varchar(100),
	`accessLevel` varchar(50) NOT NULL DEFAULT 'user',
	`approvedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`notes` text,
	`approvedBy` varchar(255),
	`denialReason` text,
	CONSTRAINT `access_control_id` PRIMARY KEY(`id`),
	CONSTRAINT `access_control_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `access_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`status` varchar(50) NOT NULL,
	`reason` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	CONSTRAINT `access_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`birthDate` timestamp NOT NULL,
	`cpf` varchar(14),
	`phone` varchar(50),
	`email` varchar(255),
	`address` text,
	`diagnosis` text,
	`medicalNotes` text,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`planId` int NOT NULL,
	`sessionDate` timestamp NOT NULL,
	`duration` int NOT NULL,
	`stimulatedPoints` text NOT NULL,
	`intensity` varchar(100),
	`observations` text,
	`patientReactions` text,
	`nextSessionDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `therapeutic_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`objective` text NOT NULL,
	`targetRegions` text NOT NULL,
	`targetPoints` text NOT NULL,
	`frequency` int NOT NULL,
	`totalDuration` int NOT NULL,
	`notes` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `therapeutic_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `specialty` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `professionalId` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `photoUrl` text;