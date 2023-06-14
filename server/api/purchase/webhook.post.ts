import { PurchaseStatus, PrismaClient } from "@prisma/client";
import { addTimeToDate, addTimeToNow, validateChecksum } from "~~/server/utils/helpers";
import { isExpired } from "~~/utils/helpers";

const prisma = new PrismaClient()

interface PaymentData {
  merchantId: string;
  merchantTransactionId: string;
  transactionId: string;
  amount: number;
  responseCode: string;
};

interface PaymentResponse {
  success: boolean;
  code: string;
  message: string;
};

interface PaymentUPIData extends PaymentData {
  paymentState: string;
  paymentInstrument: {
    type: "UPI",
    utr: string;
  }
}

interface PaymentCardData extends PaymentData {
  paymentState: string;
  paymentInstrument: {
    type: "CARD",
    cardType: string;
    pgTransactionId: string;
    bankTransactionId: string;
    pgAuthorizationCode: string;
    arn: string;
    bankId: string;
  };
}

interface PaymentNetBankingData extends PaymentData {
  state: string;
  paymentInstrument: {
    type: "NETBANKING",
    pgTransactionId: string;
    pgServiceTransactionId: string;
    bankTransactionId: null;
    bankId: string;
  };
}

interface PaymentUPIResponse extends PaymentResponse {
  data: PaymentUPIData
}

interface PaymentCardResponse extends PaymentResponse {
  data: PaymentCardData
}

interface PaymentNetBankingResponse extends PaymentResponse {
  data: PaymentNetBankingData
}

export default defineEventHandler<{ message: string }>(async (event) => {
  const config = useRuntimeConfig()
  try {
    const checksum = event.node.req.headers["x-verify"] as string
    if (checksum == null)
      throw createError({ statusCode: 401, statusMessage: "Checksum Not found" })

    const { response: payload } = await readBody<{ response: string }>(event)
    const salt = config.private.paymentSecret as any

    if (!validateChecksum(payload, salt, checksum))
      throw createError({ statusCode: 403, statusMessage: "Invalid Checksum" })

    const response: PaymentUPIResponse | PaymentCardResponse | PaymentNetBankingResponse = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
    console.log("Payment/Webhook ", { response });

    // Update Payment
    const totalPrice = (await prisma.purchase.findUniqueOrThrow({
      where: {
        id: response.data.merchantTransactionId
      }, select: {
        scales: {
          select: {
            monthlyPrice: true,
            duration: true
          }
        }
      }
    })).scales.reduce((total, { monthlyPrice, duration }) => total + (monthlyPrice / 30.0) * duration, 0)

    const purchase = await prisma.purchase.update({
      where: {
        id: response.data.merchantTransactionId
      },
      data: {
        status: response.success && response.data.amount === totalPrice * 100 ? PurchaseStatus.Success : PurchaseStatus.Failed,
      },
      select: {
        scales: {
          select: {
            name: true,
            duration: true
          }
        },
        userId: true
      }
    })

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: purchase.userId
      },
      select: {
        name: true,
        expiresAt: true,
      }
    })

    for (const { name, duration } of purchase.scales) {
      const expiresAt = subscriptions.find((subscription) => subscription.name === name)?.expiresAt

      await prisma.subscription.upsert({
        where: {
          name_userId: {
            name,
            userId: purchase.userId
          },
        },
        create: {
          name: name,
          userId: purchase.userId,
          expiresAt: addTimeToNow({ days: duration })
        }, update: {
          expiresAt: isExpired(expiresAt!) ? addTimeToNow({ days: duration }) : addTimeToDate(expiresAt!, { days: duration })
        }
      })
    }

    return { message: 'Valid signature' }
  } catch (error: any) {
    console.error("API purchase/webhook POST", error)

    if (error.statusCode === 401)
      throw error
    else if (error.statusCode === 403)
      throw error

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
});