CREATE TABLE `access_control` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
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
