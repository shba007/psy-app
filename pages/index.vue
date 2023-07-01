<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuth } from "~~/stores/auth";
import { AuthResponse } from "~/utils/models";
import hero from "~~/assets/images/hero.svg?raw";
import line from "~~/assets/images/line.svg?raw";

definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()
const authStore = useAuth()

const { isPhoneVerified } = storeToRefs(authStore)
const { handleSubmit } = useForm()
const isLoading = ref(false)

const otp = ref<{
  isSent: boolean;
  timeoutAt: null | string;
  retryTimeoutAt: null | string;
}>({
  isSent: false,
  timeoutAt: null,
  retryTimeoutAt: null
})
const { now } = useNow({ interval: 1000, controls: true })
const otpComputed = computed(() => {
  const timeoutIn = Math.floor((otp.value.timeoutAt ? new Date(otp.value.timeoutAt).getTime() - now.value.getTime() : 0) / 1000)
  const retryTimeoutIn = Math.floor((otp.value.retryTimeoutAt ? new Date(otp.value.retryTimeoutAt).getTime() - now.value.getTime() : 0) / 1000)

  return {
    timeoutIn: timeoutIn > 60 ? `${Math.floor(timeoutIn / 60)} min ${timeoutIn % 60} sec` : `${timeoutIn} sec`,
    retryTimeoutIn: retryTimeoutIn > 60 ? `${Math.floor(retryTimeoutIn / 60)} min ${retryTimeoutIn % 60} sec` : `${retryTimeoutIn} sec`
  }
})
const code = ref<string | undefined>(route.query?.code as string ?? undefined)

const tab = ref<'login' | 'register'>('login')

const { info } = storeToRefs(authStore)
const { name, phone, email, dob, gender } = toRefs(info.value)
const isRegistered = ref(false)

async function handleOAuth(vendor: 'google' | 'apple') {
  const url = await $fetchAuth<string>(`/oauth/${vendor}`)
  window.location.replace(url);
}

const onLoginSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  try {
    if (!otp.value.isSent) {
      const response = await $fetchAuth<AuthResponse>('/sms/otp', {
        method: "POST",
        body: { action: 'login', phone: values.phone }
      })

      otp.value.isSent = true
      otp.value.retryTimeoutAt = response.retryTimeoutAt
      otp.value.timeoutAt = response.timeoutAt

      authStore.setToken(response)
    } else {
      const response = await $fetchAuth<AuthResponse>("/sms/verify", {
        method: "POST",
        body: { otp: parseInt(values.otp.join("")) }
      })

      authStore.setToken(response)
      authStore.setInfo(values)
      isPhoneVerified.value = true

      if (response.isRegistered)
        router.replace({ path: '/dashboard' })
      else
        tab.value = 'register'
    }
  } catch (error) {
    console.error("Page Login", error)
  }

  isLoading.value = false
})

onBeforeMount(async () => {
  if (!code.value)
    return

  isLoading.value = true
  try {
    const response = await $fetchAuth<AuthResponse>('/oauth/google', {
      method: 'POST',
      body: { code: code.value }
    })

    authStore.setToken(response)
    authStore.setInfo(response.user)

    if (response.isRegistered)
      router.replace({ path: '/dashboard' })
    else
      tab.value = 'register'
  } catch (error) {
    console.error("Page Login", error)
  }
  isLoading.value = false
})

function resendOTP() {
  otp.value.isSent = false
}

const handleOTP = handleSubmit(async (values) => {
  isLoading.value = true

  if (isRegistered.value) {
    tab.value = 'login'
    return
  }
  try {
    if (!isPhoneVerified.value) {
      if (!otp.value.isSent) {
        const response = await $fetchAuth<AuthResponse>('/sms/otp', {
          method: "POST",
          body: { action: 'register', phone: values.phone }
        })

        isRegistered.value = response.isRegistered
        otp.value.retryTimeoutAt = response.retryTimeoutAt
        otp.value.timeoutAt = response.timeoutAt
        authStore.setToken(response)

        if (!isRegistered.value)
          otp.value.isSent = true
      } else {
        const response = await $fetchAuth<AuthResponse>("/sms/verify", {
          method: "POST",
          body: { otp: parseInt(values.otp.join("")) }
        })

        authStore.setToken(response)
        authStore.setInfo(response.user)
        isPhoneVerified.value = true

        await onRegisterSubmit()
      }
    } else
      await onRegisterSubmit()

  } catch (error) {
    console.error("Page Register", error);
  }

  isLoading.value = false
})

const onRegisterSubmit = handleSubmit(async (values: any) => {
  isLoading.value = true

  try {
    const response = await $fetchAuth<AuthResponse>('/register', {
      method: "POST",
      body: values
    })

    authStore.setToken(response)
    authStore.setInfo(values)

    if (response.isRegistered)
      router.replace({ path: '/dashboard' })

  } catch (error) {
    console.error("Page Register", error);
  }

  isLoading.value = false
})

onBeforeMount(() => {
  if (authStore.isLoggedIn === true)
    return navigateTo('/dashboard')
})
</script>

<template>
  <main class="relative w-screen h-screen flex justify-between bg-dark-400">
    <div class="grow relative flex justify-center items-center">
      <span v-html="hero" />
    </div>
    <ClientOnly>
      <div class="realtive flex justify-center items-center px-20 w-[25rem] h-full bg-dark-500">
        <article v-if="tab === 'login'" class="flex flex-col gap-4 w-full">
          <h1 class="text-xl mx-auto my-4">Welcome Back</h1>
          <section class="flex flex-col gap-3">
            <button @click="handleOAuth('google')"
              class="flex justify-center items-center gap-1 bg-dark-400 rounded-full w-full h-12">
              <NuxtIcon name="google" class="text-[24px]" :filled="true" />
              <span class="text-sm">Sign up with {{ capitalize('google') }}</span>
            </button>
            <!-- <button @click="handleOAuth('apple')"
          class="flex justify-center items-center gap-1 border-[1px] border-dark-600/30 rounded-full w-full h-12">
          <NuxtIcon name="apple" class="text-[24px]" :filled="true" />
          <span class="text-sm">Sign up with {{ capitalize('apple') }}</span>
        </button> -->
          </section>
          <div class="relative">
            <h6 class="mx-auto px-[6px] w-fit text-center bg-dark-500">or</h6>
            <span v-html="line" class="absolute left-0 right-0 top-1/2 -z-10 opacity-20" />
          </div>
          <form class="flex flex-col gap-6" @submit.prevent="onLoginSubmit">
            <InputText type="phone" name="phone" icon="phone" placeholder="Your Phone" />
            <div v-if="otp.isSent" class="flex flex-col gap-4 justify-center">
              <InputCode name="otp" />
              <div class="flex justify-between text-sm">
                <span>{{ otpComputed.timeoutIn }}</span>
                <BaseButton size="S" :title="otp.retryTimeoutAt && !isExpired(otp.retryTimeoutAt) ? otpComputed.retryTimeoutIn :
                  'Resend'" class="px-4" @click="resendOTP"
                  :disabled="otp.retryTimeoutAt && !isExpired(otp.retryTimeoutAt)" />
              </div>
            </div>
            <button type="submit" :disabled="isLoading"
              class="flex justify-center items-center gap-1 mx-8 rounded-full  h-10 text-white bg-primary-500">
              <template v-if="isLoading">
                <AnimationLoaderCircular :is-dark="false" class="scale-[62.5%]" />
                Loading
              </template>
              <template v-else>
                {{ !otp.isSent ? 'Send OTP' : 'Verify' }}
              </template>
            </button>
          </form>
        </article>
        <article v-else class="w-full">
          <form class="flex flex-col gap-4" @submit.prevent="!isPhoneVerified ? handleOTP() : onRegisterSubmit()">
            <InputText type="name" name="name" icon="avatar" :value="name" placeholder="Your Name" :disabled="!!name" />
            <div class="flex flex-col gap-6">
              <InputText type="phone" name="phone" icon="phone" :value="phone" placeholder="Your Phone"
                :disabled="!!phone" />
              <div v-if="!isPhoneVerified && otp.isSent" class="flex flex-col gap-4 justify-center">
                <InputCode name="otp" />
                <div class="flex justify-between text-sm">
                  <span>{{ otpComputed.timeoutIn }}</span>
                  <BaseButton size="S" :title="otp.retryTimeoutAt && !isExpired(otp.retryTimeoutAt) ? otpComputed.retryTimeoutIn :
                    'Resend'" @click="resendOTP" :disabled="otp.retryTimeoutAt && !isExpired(otp.retryTimeoutAt)" />
                </div>
              </div>
            </div>
            <InputText type="email" name="email" icon="attherate" :value="email" placeholder="Your Email"
              :disabled="!!email" />
            <InputDate title="Your Date of Birth" name="dob" :value="dob" />
            <InputGender title="Your Gender" name="gender" :value="gender" />
            <button type="submit" :disabled="isLoading"
              class="flex justify-center items-center gap-1 rounded-full w-full h-12 text-white transition-colors duration-300 ease-out"
              :class="isRegistered ? 'bg-primary-400' : 'bg-primary-500'">
              <template v-if="isLoading">
                <AnimationLoaderCircular :is-dark="false" class="scale-[62.5%]" />
                Loading
              </template>
              <template v-else>
                {{ !isRegistered ? (!isPhoneVerified ?
                  (!otp.isSent ? 'Send OTP' : 'Verify') : 'Register')
                  : 'Go to Login' }}
              </template>
            </button>
          </form>
        </article>
      </div>
    </ClientOnly>
  </main>
</template>