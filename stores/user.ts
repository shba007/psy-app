import type { User } from "~/utils/models";

interface PaymentInterfaces {
  upis: string[];
  banks: string[];
  cards: string[];
}

// Read
function getUser(): Promise<User> {
  return $fetchAPI('/api/user', { method: 'GET' });
};
// Update
const updatePreference = useDebounceFn(async (preference:
  {
    colorMode?: 'light' | 'dark',
    payment?: 'upi' | 'bank-transfer' | 'card' | 'cash'
  }): Promise<Preference> => {

  return await $fetchAPI('/api/user/preference', { method: 'PUT', body: trimObject(preference) });
}, 1000)

export const useUser = () => {
  const innerStore = defineStore('user', () => {
    const authStore = useAuth()
    const isInit = ref(false)

    const name = ref<string>()
    const email = ref<string | null>()
    const phone = ref<string | null>()
    // const dob = ref<Date | null>()
    // const gender = ref<string | null>()
    const payment = ref<PaymentInterfaces>({
      upis: [],
      banks: [],
      cards: []
    })
    const a = {
      upis: [],
      banks: [],
      cards: []
    }
    const preference = ref<Preference>({
      colorMode: 'light',
      payment: "upi",
    })
    const $preference = ref<Preference>({
      colorMode: 'light',
      payment: "upi",
    })

    async function init() {
      if (process.server || isInit.value)
        return
      isInit.value = true

      try {
        const data = await getUser();
        // {id, name, email,phone,gender,dob }

        name.value = data.name
        email.value = data.email
        phone.value = data.phone
        // dob.value = data.dob
        // gender.value = data.gender
        // payment.value = data.payment
        // preference.value = data.preference

      } catch (error) {
        console.error("User Store", error);
      }
    }

    function setInfo(user: any) {
      if ("email" in user) {
        name.value = user.name
        email.value = user.email
      }
      if ("phone" in user) {
        phone.value = user.phone
      }
    }

    watchEffect(async () => {
      const value = preference.value
      const oldValue = $preference.value

      if (JSON.stringify(value) == JSON.stringify(oldValue))
        return

      try {
        await updatePreference(value)
      } catch (error) {
        console.error("Store User", error);
      }

      $preference.value = { ...value }
    })


    return {
      // ,dob, gender
      name, email, phone, payment, preference,
      init, setInfo
    }
  })

  const store = innerStore()
  store.init()

  return store;
}