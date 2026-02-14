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