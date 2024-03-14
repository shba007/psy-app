import { useStorage } from '@vueuse/core'
import type { AuthResponse } from "~~/utils/models";

function anonymousLogin() {
  console.log('Anonymous Login');

  return $fetchAuth<{ accessToken: string, refreshToken: string }>("/anonymous", {
    method: "GET",
  })
}

// Update
function refetchToken(refreshToken: string) {
  return $fetchAuth<{ accessToken: string }>("/token", {
    method: "PUT",
    body: { refreshToken }
  })
};

export const useAuth = () => {
  const innerStore = defineStore('auth', () => {
    const isInit = ref(false)
    const authToken = useStorage<string>('authToken', null)
    const accessToken = useStorage<string>('accessToken', null)
    const refreshToken = useStorage<string>('refreshToken', null)
    const info = ref<{
      name: string | undefined,
      image: string | undefined,
      email: string | undefined,
      phone: string | undefined,
      dob: string | undefined,
      gender: string | undefined,
    }>({
      name: undefined,
      image: undefined,
      email: undefined,
      phone: undefined,
      dob: undefined,
      gender: undefined,
    })
    // TODO: verification
    const isPhoneVerified = ref(false)
    const isEmailVerified = ref(false)

    const isLoggedIn = computed(() => !!accessToken.value)

    async function init() {
      if (process.server || isInit.value)
        return
      isInit.value = true

      console.log("authToken", authToken.value, "accessToken", accessToken.value, "refreshToken", refreshToken.value)

      try {
        parseJWT(getToken('auth'))
      } catch (error) {
        authToken.value = null
      }

      if (accessToken.value === useRuntimeConfig().public.anoyToken ||
        refreshToken.value === useRuntimeConfig().public.anoyRefreshToken)
        resetToken()

      if (!accessToken.value || !refreshToken.value) {
        console.log("No Access Token Found");

        const { accessToken: access, refreshToken: refresh } = await anonymousLogin()
        setToken({ isRegistered: true, token: { access, refresh } })
        console.log("get", getToken('access'), "\n", getToken('refresh'))
      }

      console.log("get", getToken('access'), "\n", getToken('refresh'))
    }

    function setInfo(user: any) {
      if ("email" in user) {
        info.value.name = user.name
        info.value.email = user.email
      } else if ("phone" in user) {
        info.value.phone = user.phone
      }
    }

    function getToken(type: "auth" | "refresh" | "access") {
      switch (type) {
        case 'auth':
          return authToken.value
        case 'refresh':
          return refreshToken.value
        case 'access':
          return accessToken.value
      }
    }

    function setToken({ isRegistered, token }: Omit<AuthResponse, 'user' | 'timeoutAt' | 'retryTimeoutAt'>) {
      if (isRegistered && "access" in token) {
        accessToken.value = token.access
        refreshToken.value = token.refresh
      } else if ("auth" in token) {
        authToken.value = token.auth
      }
    }

    async function updateToken() {
      const response = await refetchToken(refreshToken.value as string)
      accessToken.value = response.accessToken
    }

    function resetToken() {
      // TODO: sent logout to auth api
      console.log("token reset")
      authToken.value = null
      accessToken.value = null
      refreshToken.value = null
    }

    return {
      info, isPhoneVerified, isEmailVerified,
      isLoggedIn,
      init, setInfo, getToken, setToken, updateToken, resetToken
    }
  })

  const store = innerStore();
  store.init()

  return store;
}