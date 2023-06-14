import { Feedback, Preference, PrismaClient, Report, Subscription } from "@prisma/client";

const prisma = new PrismaClient()

export default defineProtectedEventHandler<{
  id: string;
  preference: Preference | null;
  subscriptions: Subscription[];
  reports: Report[];
  feedbacks: Feedback[];
}>(async (event, userId) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId
      },
      select: {
        id: true,
        preference: true,
        subscriptions: true,
        reports: true,
        feedbacks: true,
      }
    })

    return user
  } catch (error: any) {
    console.error("API user/index GET", error)

    if (error.code = "P2025")
      throw createError({ statusCode: 404, statusMessage: 'User Not Found' })

    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})