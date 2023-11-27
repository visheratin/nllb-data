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
    userID: userId,
    createdAt: new Date(),
  };
  try {
    await db.insert(edits).values(update);
  } catch (e) {
    console.log(e);
    return;
  }
};

export const reportImage = async (id: string, reason: string) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to report an image");
  }
  const report: InsertReport = {
    id,
    reason,
    userID: userId,
    createdAt: new Date(),
  };
  try {
    await db.insert(reports).values(report);
  } catch (e) {
    console.log(e);
    return;
  }
};
