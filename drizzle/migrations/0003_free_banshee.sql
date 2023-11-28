CREATE TABLE `generated_captions` (
	`id` text,
	`caption` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `generatedCaptionsIndex` ON `generated_captions` (`id`);