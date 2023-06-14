import { Gender, PrismaClient, } from '@prisma/client';
import { addTimeToNow, validateSignature } from '~~/server/utils/helpers';
import { capitalize } from "~~/utils/helpers";

const prisma = new PrismaClient()

export default defineEventHandler<{ id: string, name: string }>(async (event) => {
  const config = useRuntimeConfig()
  try {
    const signature = event.node.req.headers["signature"] as string

    if (signature == null)
      throw createError({ statusCode: 401, statusMessage: "Signature Not found" })

    const body = await readBody<{
      id: string,
      name: string,
      image: string,
      email: string,
      phone: string,
      dob: string,
      gender: string
    }>(event);
    if (!validateSignature(JSON.stringify(body), signature, config.private.authWebhook))
      throw createError({ statusCode: 403, statusMessage: "Invalid Signature" })

    const scales = await prisma.scale.findMany()
    const user = await prisma.user.create({
      data: {
        id: body.id,
        name: body.name.toLowerCase(),
        email: body.email,
        phone: body.phone,
        dob: new Date(body.dob).toISOString(),
        gender: capitalize(body.gender) as Gender,
        preference: {
          create: {
            isModeLight: true,
            payment: 'UPI'
          }
        },
        subscriptions: {
          createMany: {
            data: scales.map(({ name }) => ({ name, expiresAt: addTimeToNow({ days: 3 }) }))
          }
        }
      }
    })

    return { id: user.id, name: user.name }
  } catch (error: any) {
    if (error.code == 'P2002')
      throw createError({ statusCode: 409, statusMessage: 'Phone or Email already exists' })

    console.error("API user/webhook POST", error);

    throw createError({ statusCode: 500, statusMessage: "Some Unknown Error Found" })
  }
})