import path from "node:path";
import { randomUUID } from "crypto";

import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { ScaleName, ScaleNameToDBScaleName } from "~/utils/models";
import { isExpired } from "~~/utils/helpers";
import { detectMarkers, alignCrop, extractMeta, extractData, alignInputs, highlight } from "~~/server/utils/omr";

const prisma = new PrismaClient()

async function saveImage(image: string): Promise<string | null> {
  const buffer = Buffer.from(image.split(",")[1], "base64");

  const id = randomUUID()
  const storage = useStorage()
  const filePath = path.join(process.cwd(), `assets/documents/${id}.jpg`)
  try {
    storage.setItem(id, "pending")
    await sharp(buffer).toFile(filePath)
    storage.setItem(id, true)
    console.log(`Image saved to: ${id}`);
    return `assets/documents/${id}.jpg`
  } catch (error) {
    storage.setItem(id, false)
    console.error(`Error save image: ${id}`, error);
    return null
  }
}

export default defineProtectedEventHandler<{
  data: { index: number; value: number | null; }[],
  image: string
}>(async (event, userId) => {
  try {
    const { scale, images } = await readBody<{
      scale: ScaleName,
      images: string[]
    }>(event)

    const path = await saveImage(images[0])
    if (!path)
      throw createError({ statusCode: 400, statusMessage: 'Path is null' })

    const markers = await detectMarkers(path)
    console.log({ markers });
    const croppedImage = await alignCrop(path, markers)
    const { scale: extractedScale, page } = await extractMeta(croppedImage)

    if (page.total !== images.length)
      throw createError({ statusCode: 400, statusMessage: 'Total Page Mismatched' })
    if (scale !== extractedScale)
      throw createError({ statusCode: 400, statusMessage: 'Scale Mismatched' })

    const { expiresAt, scale: DBScale } = await prisma.subscription.findUniqueOrThrow({
      where: {
        name_userId: {
          name: ScaleNameToDBScaleName[extractedScale],
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

    const inputs = await alignInputs(croppedImage, DBScale.count)
    const data = await extractData(croppedImage, inputs)
    console.log(data);

    // const highlightedImage = await highlight(croppedImage, inputs, 'both', data)
    // highlightedImage.toString('base64')

    return { data, image: "" }
  } catch (error: any) {
    console.error("API scale/index POST", error)

    if (error.statusCode === 400)
      throw error
    else if (error.code = "P2025")
      throw createError({ statusCode: 404, statusMessage: 'Subscription Not Found' })

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})