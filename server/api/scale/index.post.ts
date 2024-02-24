import { PrismaClient, ReportStatus } from "@prisma/client";
import { type ScaleName, ScaleNameToDBScaleName } from "~/utils/models";
import { dataScales } from "~/server/utils/data"

const prisma = new PrismaClient()

export default defineProtectedEventHandler<{ name: string; value: number; }[]>(async (event, userId) => {
  try {
    const { scale, data } = await readBody<{
      scale: ScaleName,
      data: { index: number; value: number; }[]
    }>(event)

    const DBScale = dataScales.find(({ name }) => name === scale)

    if (DBScale == undefined)
      throw createError({ statusCode: 404, statusMessage: `${scale} Scale not found` });

    let result: {} = {}
    for (const item of data) {
      if (item.value === null || !(item.value === 0 || item.value === 1 || item.value === 2 || item.value === 3 || item.value === 4 || item.value == 5))
        throw createError({ statusCode: 400, statusMessage: 'Invalid value detected. Value must be 0 to 5' });
    }

    // Calculate
    if (DBScale.type === 'binary')
      result = BinaryCalculate(scale, data.map(({ index, value }) => ({ index, value: !!value })))
    else if (DBScale.type === 'pentanary')
      result = PentanaryCalculate(scale, data)

    const formattedResult = Object.entries(result).map(([name, value]) => ({ name, value: value as number }));

    await prisma.report.create({
      data: {
        scale: ScaleNameToDBScaleName[scale],
        status: ReportStatus.Complete,
        data,
        value: formattedResult,
        userId: userId
      }
    })

    return formattedResult
  } catch (error: any) {
    console.error("API scale/index POST", error)

    if (error.statusCode === 400)
      throw error
    else if (error.code = "P2025")
      throw createError({ statusCode: 404, statusMessage: 'Subscription Not Found' })

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})