DROP TABLE `access_control`;--> statement-breakpoint
DROP TABLE `access_log`;--> statement-breakpoint
DROP TABLE `patients`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
DROP TABLE `therapeutic_plans`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `specialty`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `professionalId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `photoUrl`;