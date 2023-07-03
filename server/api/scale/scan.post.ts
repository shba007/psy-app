import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { ofetch } from 'ofetch'

import { PrismaClient } from "@prisma/client";
import { ScaleName, ScaleNameToDBScaleName } from "~/utils/models";
import { isExpired } from "~~/utils/helpers";

const prisma = new PrismaClient()

async function saveImages(images: string[]): Promise<void> {
  const buffer = Buffer.from(images[0].split(",")[1], "base64");

  const id = randomUUID();
  const storage = useStorage();
  const filePath = path.join(process.cwd(), `assets/documents/${id}.jpg`);

  try {
    storage.setItem(id, "pending");
    fs.writeFileSync(filePath, buffer);
    storage.setItem(id, true);
    console.log(`Image saved as: ${id}`);
  } catch (error) {
    storage.setItem(id, false);
    console.error(`Error saving image: ${id}`, error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to save images' })
  }
}

export default defineProtectedEventHandler<{
  data: { index: number; value: number | null; }[],
  highlights: string[]
}>(async (event, userId) => {
  const config = useRuntimeConfig()

  try {
    const { scale, images } = await readBody<{
      scale: ScaleName,
      images: string[]
    }>(event)

    saveImages(images)

    const { expiresAt, scale: DBScale } = await prisma.subscription.findUniqueOrThrow({
      where: {
        name_userId: {
          name: ScaleNameToDBScaleName[scale],
          userId
        }
      },
      select: {
        scale: {
          select: {
            type: true,
            count: true
          }
        },
        expiresAt: true,
      }
    })

    if (isExpired(expiresAt))
      throw createError({ statusCode: 400, statusMessage: 'Subscription Expired' })

    try {
      const { data, highlights } = await ofetch<{ data: { index: number; value: number | null; }[], highlights: string[] }>('/scan', {
        baseURL: config.private.omrUrl,
        method: 'POST',
        body: {
          scale,
          itemCount: DBScale.count,
          images
        }
      })

      return { data, highlights }
    } catch (error: any) {
      if (error === 'scale_mismatched')
        throw createError({ statusCode: 400, statusMessage: 'Scale Mismatched' })
      else if (error === 'page_mismatched')
        throw createError({ statusCode: 400, statusMessage: 'Total Page Mismatched' })
      else
        throw new Error(error)
    }
  } catch (error: any) {
    console.error("API scale/index POST", error)

    if (error.statusCode === 400)
      throw error
    else if (error.statusCode === 500)
      throw error
    else if (error.code = "P2025")
      throw createError({ statusCode: 404, statusMessage: 'Subscription Not Found' })

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})