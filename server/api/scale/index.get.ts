import { PrismaClient } from "@prisma/client"
import { ScaleType, SubscribedScale, DBScaleNameToScaleName } from "~/utils/models"

const prisma = new PrismaClient()

export default defineProtectedEventHandler<SubscribedScale[]>(async (event, userId) => {
  try {
    const scales = await prisma.scale.findMany({
      select: {
        name: true,
        type: true,
        count: true,
        subScales: true,
        options: {
          select: {
            name: true,
            value: true
          }
        },
        monthlyPrice: true,
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })
    const subscribedScales = await prisma.subscription.findMany({
      where: {
        userId
      },
      select: {
        name: true,
        expiresAt: true
      }
    })

    return scales.map(({ name, type, count, subScales, options, monthlyPrice, publishedAt, updatedAt }) => {
      const subscribedScale = subscribedScales.find((subscribedScale) => subscribedScale.name === name)

      return {
        name: DBScaleNameToScaleName[name],
        type: type.toLowerCase() as ScaleType,
        count,
        options,
        subScales,
        monthlyPrice,
        expiresAt: subscribedScale?.expiresAt.toISOString() ?? null,
        updatedAt: updatedAt.toISOString(),
        publishedAt: publishedAt.toISOString()
      }
    })
  } catch (error: any) {
    console.error("API scale/index GET", error)

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})