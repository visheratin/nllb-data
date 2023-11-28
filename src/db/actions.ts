"use server";
import { db } from "./db";
import { auth } from "@clerk/nextjs";
import {
  InsertEdit,
  InsertGeneratedCaption,
  InsertReport,
  edits,
  generatedCaptions,
  reports,
} from "./schema";

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

export const generateCaption = async (id: string): Promise<string> => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to generate captions");
  }
  const existingCaption = await db.query.generatedCaptions.findFirst({
    where: (generatedCaptions, { eq }) => eq(generatedCaptions.id, id),
  });
  if (existingCaption) {
    return existingCaption.caption ?? "";
  }
  const requestBody = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Generate the caption in MS COCO style. Pay attention to details, colors, and number of objects.",
          },
          {
            type: "image_url",
            image_url: {
              url: `https://nllb-data.com/${id}.jpg`,
              detail: "low",
            },
          },
        ],
      },
    ],
    max_tokens: 100,
  };
  const response = await fetch(
    `https://gateway.ai.cloudflare.com/v1/${process.env.GATEWAY_PATH}/openai/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  const caption = data.choices[0].message.content ?? "";
  if (caption !== "") {
    const generatedCaption: InsertGeneratedCaption = {
      id,
      caption,
      userID: userId,
      createdAt: new Date(),
    };
    try {
      await db.insert(generatedCaptions).values(generatedCaption);
    } catch (e) {
      console.log(e);
    }
  }
  return caption;
};
