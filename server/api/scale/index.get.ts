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
        labels: {
          select: {
            name: true,
            value: true
          }
        },
        monthlyPrice: true,
        publishedAt: true,
        updatedAt: true,
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

    return scales.map(({ name, type, count, subScales, labels, monthlyPrice, publishedAt, updatedAt }) => {
      const subscribedScale = subscribedScales.find((subscribedScale) => subscribedScale.name === name)

      return {
        name: DBScaleNameToScaleName[name],
        type: type.toLowerCase() as ScaleType,
        count,
        labels,
        subScales,
        monthlyPrice,
        expiresAt: subscribedScale?.expiresAt.toISOString() ?? null,
        updatedAt: updatedAt.toISOString()
      }
    })
  } catch (error: any) {
    console.error("API scale/index GET", error)

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})