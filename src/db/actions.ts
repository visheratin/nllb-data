"use server";
import { db } from "./db";
import { auth } from "@clerk/nextjs";
import { InsertEdit, InsertReport, edits, reports } from "./schema";

export interface StoredCaption {
  lang: string;
  text: string;
}

export const getCaptions = async (id: string): Promise<StoredCaption[]> => {
  const userInfo = await db.query.captions.findFirst({
    where: (captions, { eq }) => eq(captions.id, id),
  });
  let captions = userInfo?.value ?? "[]";
  const captionsList = JSON.parse(captions) as StoredCaption[];
  return captionsList;
};

export const editCaption = async (
  id: string,
  langCode: string,
  value: string
) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to edit a caption");
  }
  const update: InsertEdit = {
    id,
    langCode,
    value,
    user_id: userId,
    created_at: new Date(),
  };
  await db.insert(edits).values(update);
};

export const reportImage = async (id: string, reason: string) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to report an image");
  }
  const report: InsertReport = {
    id,
    reason,
    user_id: userId,
    created_at: new Date(),
  };
  await db.insert(reports).values(report);
};
