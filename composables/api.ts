import { NitroFetchRequest, TypedInternalResponse } from "nitropack";
import { FetchOptions, ofetch } from "ofetch";
import { parseJWT } from "~~/utils/helpers";
import { useAuth } from "~~/stores/auth";

export const $fetchAPI = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined): Promise<TypedInternalResponse<R, T>> => {
  const config = useRuntimeConfig()
  const authStore = useAuth()
  const baseURL = config.public.apiUrl

  const customFetch = ofetch.create({
    baseURL: baseURL,
    headers: { 'Authorization': `Bearer ${authStore.getToken("access")}` },
    async onRequest({ request, options }) {
      console.log("Intercepted API", request);

      if (!authStore.getToken("access")) {
        console.log({ accessToken: authStore.getToken("access") })
        throw createError({ "message": "No Access Token Found" })
      }
      // check access token is expired
      try {
        parseJWT(authStore.getToken('access'))
      } catch (error) {
        await authStore.updateToken()
        // @ts-ignore
        options.headers['Authorization'] = `Bearer ${authStore.getToken("access")}`
      }
    }
  })

  // @ts-ignore
  return customFetch(request, opts)
}

export const $fetchAuth = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined): Promise<TypedInternalResponse<R, T>> => {
  const config = useRuntimeConfig()
  const authStore = useAuth()
  const baseURL = config.public.authUrl

  const customFetch = ofetch.create({
    baseURL: baseURL,
    onRequest({ request, options }) {
      console.log("Intercepted API", request);

      if (authStore.getToken("auth"))
        options.headers = { 'Authorization': `Bearer ${authStore.getToken("auth")}` }
    },
  })

  // @ts-ignore
  return customFetch(request, opts)
}