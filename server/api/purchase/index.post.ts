import { PrismaClient } from "@prisma/client"
import { createUPIPayment } from "~~/server/utils/payment";
import { PurchaseStatus, DBScaleNameToScaleName } from "~/utils/models";

const prisma = new PrismaClient()

export default defineProtectedEventHandler<{
  id: string;
  purchasedAt: string;
  status: PurchaseStatus;
  qrImage: string;
}>(async (event, userId) => {
  try {
    const { scales: purchasedScales } = await readBody<{ scales: string[] }>(event)
    console.log("API purchase", { purchasedScales });

    if (purchasedScales.length === 0)
      throw createError({ statusCode: 400, statusMessage: "Select at least a Scale" })

    const allScales = (await prisma.scale.findMany({
      select: {
        name: true,
        monthlyPrice: true,
      }
    })).filter(({ name }) => purchasedScales.includes(DBScaleNameToScaleName[name]))

    const duration = 30

    console.log(allScales);

    if (allScales.length === 0)
      throw createError({ statusCode: 400, statusMessage: "Select at least a valid Scale" })

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        scales: {
          createMany: {
            data: allScales.map(({ name, monthlyPrice }) => ({
              name,
              duration,
              monthlyPrice
            }))
          },
        },
      },
      select: {
        id: true,
        status: true,
        purchasedAt: true,
        user: {
          select: {
            phone: true
          }
        }, scales: {
          select: {
            duration: true,
            monthlyPrice: true
          }
        }
      }
    })

    const totalPrice = purchase.scales.reduce((total, { monthlyPrice, duration },) => total + (monthlyPrice / 30) * duration, 0)

    const gatewayResult = await createUPIPayment({
      transactionId: purchase.id,
      // @ts-ignore
      amount: totalPrice,
      phone: purchase.user.phone,
      type: "qr",
    })

    // console.log({ qr: gatewayResult.qr });

    return {
      id: purchase.id,
      purchasedAt: purchase.purchasedAt.toISOString(),
      status: purchase.status.toLowerCase() as PurchaseStatus,
      qrImage: `data:image/png;base64,${gatewayResult.qr}!`,
    }
  } catch (error: any) {
    console.error("API purchase/index POST", error)

    if (error.statusCode === 400)
      throw error

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})