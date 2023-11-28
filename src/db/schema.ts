import {
  sqliteTable,
  text,
  uniqueIndex,
  integer,
} from "drizzle-orm/sqlite-core";

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

export const edits = sqliteTable(
  "edits",
  {
    id: text("id"),
    langCode: text("lang_code"),
    value: text("value"),
    userID: text("user_id"),
    createdAt: integer("created_at", { mode: "timestamp" }),
  },
  (edits) => ({
    editsIndex: uniqueIndex("editsIndex").on(
      edits.id,
      edits.langCode,
      edits.userID
    ),
  })
);

export type Edit = typeof edits.$inferSelect;
export type InsertEdit = typeof edits.$inferInsert;

export const reports = sqliteTable(
  "reports",
  {
    id: text("id"),
    reason: text("reason"),
    userID: text("user_id"),
    createdAt: integer("created_at", { mode: "timestamp" }),
  },
  (reports) => ({
    reportsIndex: uniqueIndex("reportsIndex").on(reports.id, reports.userID),
  })
);

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

export const generatedCaptions = sqliteTable(
  "generated_captions",
  {
    id: text("id"),
    caption: text("caption"),
    userID: text("user_id").default(""),
    createdAt: integer("created_at", { mode: "timestamp" }),
  },
  (generatedCaptions) => ({
    generatedCaptionsIndex: uniqueIndex("generatedCaptionsIndex").on(
      generatedCaptions.id
    ),
  })
);

export type GeneratedCaption = typeof generatedCaptions.$inferSelect;
export type InsertGeneratedCaption = typeof generatedCaptions.$inferInsert;
