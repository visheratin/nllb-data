CREATE UNIQUE INDEX `editsIndex` ON `edits` (`id`,`lang_code`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reportsIndex` ON `reports` (`id`,`user_id`);