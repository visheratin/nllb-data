CREATE TABLE `edits` (
	`id` text,
	`lang_code` text,
	`value` text,
	`user_id` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text,
	`reason` text,
	`user_id` text,
	`created_at` integer
);
