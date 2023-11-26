CREATE TABLE `captions` (
	`id` text PRIMARY KEY NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idIndex` ON `captions` (`id`);