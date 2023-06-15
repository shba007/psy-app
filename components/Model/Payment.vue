<script setup lang="ts">
import { PurchaseStatus, SubscribedScale } from '~/utils/models';

const props = defineProps<{ isOpen: boolean, selectedScale: string, scales: SubscribedScale[] }>()
const emit = defineEmits<{
  (event: 'close'): void
}>()

const isLoading = ref(false)
const tab = ref<'select' | 'payment' | 'complete'>('select')

const selectedScales = ref(new Set<string>([props.selectedScale]))

const purchaseResponse = ref<{
  id: string;
  purchasedAt: string;
  status: PurchaseStatus;
  qrImage: string
}>()

/* watch(() => props.selectedScale, () => {
  if (!!props.selectedScale)
    selectedScales.value.add(props.selectedScale)
}) */

const totalPrice = computed(() => {
  let total = 0
  selectedScales.value.forEach((scale) => {
    total += props.scales.find(({ name }) => name === scale)?.monthlyPrice ?? 0
  })
  return total
})

function toggle(scale: string) {
  selectedScales.value.has(scale) ? selectedScales.value.delete(scale) : selectedScales.value.add(scale)
}

function onMassSelect(type: 'select' | 'deselect') {
  props.scales.forEach(({ name }) => {
    if (type === 'select')
      selectedScales.value.add(name)
    else
      selectedScales.value.delete(name)
  })
}

const { resume, pause } = useIntervalFn(async () => {
  purchaseResponse.value!.status = (await $fetchAPI<{ status: PurchaseStatus }>(`/api/purchase/${purchaseResponse.value?.id}`, {
    method: 'GET',
  })).status

  if (purchaseResponse.value?.status !== 'pending') {
    tab.value = 'complete'
    pause()

    setTimeout(() => {
      emit('close')
    }, 5000)
  }

}, 3000, { immediate: false })

async function onPay() {
  tab.value = 'payment'
  isLoading.value = true
  const response = await $fetchAPI('/api/purchase', {
    method: 'POST',
    body: {
      scales: Array.from(selectedScales.value.keys())
    }
  })

  purchaseResponse.value = response
  isLoading.value = false
  resume()
}
</script>

<template>
  <ModelBase :is-open="isOpen" @close="emit('close')" id="payment"
    class="grid grid-rows-[repeat(3,auto)] grid-cols-[repeat(2,auto)] gap-6 w-[500px] h-[375px]">
    <template v-if="tab === 'select'">
      <h6 class="row-start-1 col-start-1 text-lg">Choose Scales to Recharge</h6>
      <div class="row-start-2 col-start-1 flex gap-3 flex-wrap">
        <BaseChips v-for="{ name, monthlyPrice } in scales" :title="`${name} - ₹${monthlyPrice}`"
          class="!px-4 !py-1 cursor-pointer" :class="{ 'bg-primary-400': selectedScales.has(name) }"
          @click="toggle(name)" />
      </div>
      <div class="relative row-start-2 col-start-2 flex flex-col gap-3">
        <BaseButton size="M" :rounded="true" title="Select All" class="!py-1 !w-full" @click="onMassSelect('select')" />
        <BaseButton size="M" :rounded="true" title="Deselect All" class="!py-1 !w-full !bg-dark-400"
          @click="onMassSelect('deselect')" />
      </div>
      <div class="row-start-3 col-start-1 flex flex-col p-3 rounded-lg w-[175px] h-[159px] bg-primary-400">
        <span class="text-xl">₹ {{ totalPrice }}</span>
        <span class="text-sm">30 days</span>
      </div>
      <BaseButton size="M" :rounded="true" title="Pay Now"
        class="self-end justify-self-end row-start-3 col-start-2 !py-1 h-fit" @click="onPay" :disabled="!totalPrice" />
    </template>
    <div v-else-if="tab === 'payment'"
      class="row-start-1 row-span-full col-start-1 col-span-full justify-self-center self-center flex flex-col gap-6 justify-center items-center p-4 pb-8">
      <h6 class="mx-auto text-lg">Scan to Pay</h6>
      <div class="flex justify-center items-center mx-auto p-4 w-[224px] h-[224px] bg-white rounded-md">
        <NuxtIcon v-if="isLoading" name="loader" class="text-[18px] text-black" />
        <img v-else :src="purchaseResponse?.qrImage" alt="qr" class="w-full h-full" />
      </div>
    </div>
    <div v-else
      class="row-start-1 row-span-full col-start-1 col-span-full justify-self-center self-center flex flex-col gap-6 justify-center items-center p-4 pb-8">
      <div v-if="!!purchaseResponse" class="row-start-1 row-span-2 col-start-1 col-span-2 self-center p-4 mx-auto">
        <svg v-if="purchaseResponse.status == 'failed'" width="128" height="128" viewBox="0 0 96 96" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M85.7073 48.0461C85.7073 69.0584 68.7597 86.0922 47.8537 86.0922C26.9477 86.0922 10 69.0584 10 48.0461C10 27.0338 26.9477 10 47.8537 10C68.7597 10 85.7073 27.0338 85.7073 48.0461ZM14.5424 48.0461C14.5424 66.5369 29.4564 81.5266 47.8537 81.5266C66.2509 81.5266 81.1649 66.5369 81.1649 48.0461C81.1649 29.5553 66.2509 14.5655 47.8537 14.5655C29.4564 14.5655 14.5424 29.5553 14.5424 48.0461Z"
            fill="#E11D48" />
          <path
            d="M34.3592 32.788C33.9277 32.7881 33.4961 32.9536 33.1669 33.2846C32.8376 33.6155 32.673 34.0492 32.6729 34.4829C32.673 34.9167 32.8376 35.3512 33.1669 35.6821L45.4683 48.0461L33.6022 59.9725C32.9435 60.6346 32.9435 61.708 33.6022 62.3701C34.2609 63.0322 35.3289 63.0322 35.9876 62.3701L47.8537 50.4437L59.7199 62.3701C60.3786 63.0322 61.4466 63.0322 62.1053 62.3701C62.764 61.708 62.764 60.6346 62.1053 59.9725L50.2392 48.0461L62.5406 35.6821C62.87 35.3511 63.0346 34.9172 63.0346 34.4834C63.0346 34.0495 62.87 33.6156 62.5406 33.2846C62.2113 32.9536 61.7792 32.7881 61.3477 32.788C60.9162 32.7881 60.4844 32.9536 60.1551 33.2846L47.8537 45.6485L35.5523 33.2846C35.2231 32.9536 34.7907 32.7881 34.3592 32.788Z"
            fill="#E11D48" />
        </svg>
        <svg v-else width="128" height="128" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M85.7073 48.0461C85.7073 69.0584 68.7597 86.0922 47.8537 86.0922C26.9477 86.0922 10 69.0584 10 48.0461C10 27.0338 26.9477 10 47.8537 10C68.7597 10 85.7073 27.0338 85.7073 48.0461ZM14.5424 48.0461C14.5424 66.5369 29.4564 81.5266 47.8537 81.5266C66.2509 81.5266 81.1649 66.5369 81.1649 48.0461C81.1649 29.5553 66.2509 14.5655 47.8537 14.5655C29.4564 14.5655 14.5424 29.5553 14.5424 48.0461Z"
            fill="#3B82F6" />
          <path
            d="M67.372 34.9844V34.9534C67.3677 34.3341 67.1021 33.7208 66.5917 33.2933C65.6716 32.5226 64.3041 32.6475 63.5373 33.5723L43.3706 57.8954L32.0377 46.5048C31.1907 45.6536 29.8176 45.6536 28.9706 46.5048C28.5477 46.9299 28.336 47.4868 28.3354 48.044V48.0482C28.336 48.6054 28.5477 49.1623 28.9706 49.5874L41.9828 62.6658C42.4137 63.0988 43.0059 63.3297 43.6146 63.3019C44.2233 63.2742 44.7923 62.9904 45.1824 62.5199L66.8694 36.3632C67.2037 35.96 67.3686 35.4713 67.372 34.9844Z"
            fill="#3B82F6" />
        </svg>
      </div>
      <span class="row-start-3 col-start-1 col-span-2 mx-auto text-lg">
        Payment {{ purchaseResponse?.status == 'success' ? 'Successful' : 'Failed' }}
      </span>
    </div>
  </ModelBase>
</template>