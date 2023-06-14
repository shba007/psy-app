import { PrismaClient } from "@prisma/client";
import { ScaleName, ScaleNameToDBScaleName } from "~/utils/models";
import { isExpired } from "~~/utils/helpers";

const prisma = new PrismaClient()

export default defineProtectedEventHandler<{ name: string; value: number; }[]>(async (event, userId) => {
  try {
    const { scale, data } = await readBody<{
      scale: ScaleName,
      data: { index: number; value: boolean | number; }[]
    }>(event)

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
            type: true
          }
        },
        expiresAt: true
      }
    })

    if (isExpired(expiresAt))
      throw createError({ statusCode: 400, statusMessage: 'Subscription Expired' })

    // console.log({ scale, data });

    let result: {} = {}
    // Calculate
    if (DBScale.type = 'Binary')
      // @ts-ignore
      result = BinaryCalculate(scale, data)
    else if (DBScale.type = 'Pentanary')
      // @ts-ignore
      result = PentanaryCalculate(scale, data)

    return Object.entries(result).map(([name, value]) => ({ name, value: value as number }));
  } catch (error: any) {
    console.error("API scale/index POST", error)

    if (error.statusCode === 400)
      throw error
    else if (error.code = "P2025")
      throw createError({ statusCode: 404, statusMessage: 'Subscription Not Found' })

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})