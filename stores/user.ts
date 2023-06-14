import { PaymentInterfaces, Preference, User } from "~~/utils/models";

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
    const isInit = ref(false)
    // Cache It
    const name = ref<string>()
    const email = ref<string | null>()
    const phone = ref<string>()
    // const dob = ref<string>()
    // const gender = ref<string>()
    const image = ref<string | null>()
    const payment = ref<PaymentInterfaces>({
      upis: [],
      banks: [],
      cards: []
    })
    const preference = ref<Preference>({
      colorMode: 'light',
      payment: "upi",
    })
    const $preference = ref<Preference>({
      colorMode: 'light',
      payment: "upi",
    })
    const isMainDrawerOpen = ref(false)

    async function init() {
      if (process.server || isInit.value)
        return
      isInit.value = true

      try {
        const data = await getUser();

        name.value = data.name
        image.value = data.image
        email.value = data.email
        phone.value = data.phone
        // dob.value
        // gender.value
        $addresses.value = data.addresses
        payment.value = data.payment
        preference.value = data.preference

        data.queries.forEach(q => searchStore.searches.set(q.title, q.time))
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

    function toggleMainDrawer(context: 'page' | 'menu') {
      if (context === 'page') {
        if (isMainDrawerOpen.value)
          isMainDrawerOpen.value = false
      } else {
        isMainDrawerOpen.value = !isMainDrawerOpen.value
      }
    }

    return {
      // ,dob, gender
      name, email, phone, image, payment, preference, isMainDrawerOpen,
      init, setInfo, toggleMainDrawer
    }
  })

  const store = innerStore()
  store.init()

  return store;
}