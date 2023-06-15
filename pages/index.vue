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
const isOTPSent = ref(false)
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
    if (!isOTPSent.value) {
      const response = await $fetchAuth<AuthResponse>('/sms/otp', {
        method: "POST",
        body: { action: 'login', phone: values.phone }
      })

      isOTPSent.value = true
      authStore.setToken(response)
    } else {
      const response = await $fetchAuth<AuthResponse>("/sms/verify", {
        method: "POST",
        body: { otp: parseInt(values.otp.join("")) }
      })

      authStore.setToken(response)
      authStore.setInfo(values)
      isPhoneVerified.value = true
      router.replace({ path: response.isRegistered ? "/dashboard" : "/auth/register" })
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

const handleOTP = handleSubmit(async (values) => {
  isLoading.value = true

  if (isRegistered.value) {
    router.replace({ path: "/auth/login" })
    return
  }
  try {
    if (!isPhoneVerified.value) {
      if (!isOTPSent.value) {
        const response = await $fetchAuth<AuthResponse>('/sms/otp', {
          method: "POST",
          body: { action: 'register', phone: values.phone }
        })

        isRegistered.value = response.isRegistered
        authStore.setToken(response)

        if (!isRegistered.value)
          isOTPSent.value = true
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
      <div class="realtive flex justify-center items-center px-20 w-[25rem] h-full bg-dark-500 ">
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
            <InputCode v-if="isOTPSent" name="otp" />
            <button type="submit" :disabled="isLoading"
              class="flex justify-center items-center gap-1 mx-8 rounded-full  h-10 text-white bg-primary-500">
              <template v-if="isLoading">
                <AnimationLoaderCircular :is-dark="false" class="scale-[62.5%]" />
                Loading
              </template>
              <template v-else>
                {{ !isOTPSent ? 'Send OTP' : 'Verify' }}
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
              <InputCode v-if="!isPhoneVerified && isOTPSent" name="otp" />
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
                  (!isOTPSent ? 'Send OTP' : 'Verify') : 'Register')
                  : 'Go to Login' }}
              </template>
            </button>
          </form>
        </article>
      </div>
    </ClientOnly>
  </main>
</template>