import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const captions = sqliteTable(
  "captions",
  {
    id: text("id").primaryKey(),
    value: text("value"),
  },
  (captions) => ({
    idIndex: uniqueIndex("idIndex").on(captions.id),
  })
);

export type Caption = typeof captions.$inferSelect;
export type InsertCaption = typeof captions.$inferInsert;
