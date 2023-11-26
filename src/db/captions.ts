"use server";
import { db } from "./db";

export const runtime = "edge";

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
