import type { EventHandlerResponse, H3Event } from "h3";
import JWT from "jsonwebtoken";
import type { JWTToken } from "~~/utils/models";

export function defineProtectedEventHandler<T>(handler: (event: H3Event, userId: string) => EventHandlerResponse<T>) {
  return defineEventHandler<Promise<T | undefined>>(async (event) => {
    try {
      const config = useRuntimeConfig()
      const authHeader = event.node.req.headers['authorization']
      const token = authHeader && authHeader.split(" ")[1]

      if (token == null)
        throw createError({ statusCode: 404, statusMessage: "Token Not found" })

      try {
        const { id: userId } = JWT.verify(token, config.private.authAccessSecret) as JWTToken

        return handler(event, userId)
      } catch (error: any) {
        if (error instanceof JWT.TokenExpiredError)
          throw createError({ statusCode: 401, statusMessage: "Token Expired" })
        else
          throw createError({ statusCode: 498, statusMessage: "Invalid Token" })
      }
    } catch (error: any) {
      sendError(event, error)
    }
  })
}