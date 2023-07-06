<script setup lang="ts">
import { Options, Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import { ScaleType } from '~/utils/models';

const props = defineProps<{
  isOpen: boolean,
  name: string,
  type: ScaleType,
  count: number,
  options: { name: string, value: number }[],
  choices?: { index: number; value: number | null; }[]
}>()
const emit = defineEmits<{
  (event: 'close'): void,
  (event: 'calculate', data: { index: number; value: number | null; }[]): void
}>()

/* -------------------- */
const dataSplideOption: Options = {
  arrows: true,
  pagination: true,
  gap: '1rem',
  classes: {
    pagination: 'pagination',
    page: 'pagination-page',
  },
};

const splide = ref();
const isLoading = ref(false)
const isLastSlide = ref(false)

const choices = ref<{ index: number; value: number | null; }[]>(props.choices ?? new Array(props.count)
  .fill(0)
  .map((_, index) =>
    ({ index: index + 1, value: null })))
// Math.random() > 0.5 ? 0 : 1
watch(() => props.choices, (value) => {
  if (!!value)
    choices.value = value
})

const choicesSlides = computed(() => {
  const slides = [];
  const groups = []

  const groupPerSlide = props.type === 'binary' ? 6 : 4

  for (let choiceIndex = 0; choiceIndex < choices.value.length; choiceIndex += 5) {
    groups.push(choices.value.slice(choiceIndex, Math.min(choiceIndex + 5, choices.value.length)))
  }

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += groupPerSlide) {
    slides.push(groups.slice(groupIndex, Math.min(groupIndex + groupPerSlide, groups.length)))
  }

  return slides
})

const result = ref<{ name: string, value: number }[]>()

watch(choices, () => {
  result.value = undefined
})

const currentChoiceIndex = ref(0)
const currentChoiceValue = computed(() => choices.value[currentChoiceIndex.value].value)
const invalidChoiceIndex = ref<number | null>(null)
const minLimit = computed(() => props.options.reduce((min, { value }) => value < min ? value : min, 9999))
const maxLimit = computed(() => props.options.reduce((max, { value }) => value > max ? value : max, 0))

watch(currentChoiceIndex, (value) => {
  const groupPerSlide = props.type === 'binary' ? 6 : 4
  splide.value.go(Math.floor(value / (5 * groupPerSlide)))
})

function checkScaleItemValidity({ minLimit, maxLimit }: { minLimit: number, maxLimit: number }, data: { index: number; value: number; }[]) {
  invalidChoiceIndex.value = null

  for (const { index, value } of data) {
    if (value === null || !(value >= minLimit && value <= maxLimit)) {
      invalidChoiceIndex.value = index - 1
      break;
    }
  }

  if (invalidChoiceIndex.value === null)
    return true

  const groupPerSlide = props.type === 'binary' ? 6 : 4
  const goToSlideIndex = Math.floor(invalidChoiceIndex.value / (5 * groupPerSlide))
  splide.value.go(goToSlideIndex)
  isLastSlide.value = goToSlideIndex === Math.floor(data.length / (5 * groupPerSlide))
  currentChoiceIndex.value = invalidChoiceIndex.value

  result.value = undefined

  return false
}

function onInput(index: number, value: number) {
  if (!(value >= minLimit.value && value <= maxLimit.value))
    return

  choices.value[index].value = value
  currentChoiceIndex.value = index
}

function onMove(_slide: any, list: { items: string | any[]; }, _prev: any, curr: { page: number; }) {
  if (curr?.page)
    isLastSlide.value = curr.page === list.items.length - 1
}

const { arrowLeft, arrowRight, arrowUp, arrowDown, t, f, numpad0, numpad1, numpad2, numpad3, numpad4, numpad5, digit0, digit1, digit2, digit3, digit4, digit5 } = useMagicKeys()

watchArray([arrowLeft, arrowRight, arrowUp, arrowDown,
  t, f,
  numpad0, numpad1, numpad2, numpad3, numpad4, numpad5,
  digit0, digit1, digit2, digit3, digit4, digit5], ([left, right, up, down,
    t, f,
    numpad0, numpad1, numpad2, numpad3, numpad4, numpad5,
    digit0, digit1, digit2, digit3, digit4, digit5]) => {

  if (left) {
    const dir = props.type === 'binary' ? -1 : 1
    const nextChoiceValue = currentChoiceValue.value !== null ? Math.max(currentChoiceValue.value - 1 * dir, minLimit.value) : props.type === 'binary' ? maxLimit.value : minLimit.value
    onInput(currentChoiceIndex.value, nextChoiceValue)
  } else if (right) {
    const dir = props.type === 'binary' ? -1 : 1
    const nextChoiceValue = currentChoiceValue.value !== null ? Math.min(currentChoiceValue.value + 1 * dir, maxLimit.value) : props.type === 'binary' ? maxLimit.value : minLimit.value
    onInput(currentChoiceIndex.value, nextChoiceValue)
  } else if (up) {
    currentChoiceIndex.value -= currentChoiceIndex.value > 0 ? 1 : 0
  } else if (down) {
    currentChoiceIndex.value += currentChoiceIndex.value < choices.value.length - 1 ? 1 : 0
  } else if (f || numpad0 || digit0) {
    onInput(currentChoiceIndex.value, 0)
  } else if (t || numpad1 || digit1) {
    onInput(currentChoiceIndex.value, 1)
  } else if (numpad2 || digit2) {
    onInput(currentChoiceIndex.value, 2)
  } else if (numpad3 || digit3) {
    onInput(currentChoiceIndex.value, 3)
  } else if (numpad4 || digit4) {
    onInput(currentChoiceIndex.value, 4)
  } else if (numpad5 || digit5) {
    onInput(currentChoiceIndex.value, 5)
  }
})

async function onCalculate(data: { index: number; value: number; }[]) {
  useTrackEvent('calculate', {
    scale: props.name,
  })

  if (!checkScaleItemValidity({ minLimit: minLimit.value, maxLimit: maxLimit.value }, data))
    return

  if (isLoading.value)
    return

  isLoading.value = true
  try {
    result.value = await $fetchAPI('/api/scale', {
      method: 'POST',
      body: {
        scale: props.name,
        data
      }
    })

    setTimeout(() => splide.value.go('>'), 300)
  } catch (error) {
    console.error("Fetch API Scale", error);
  }
  isLoading.value = false
}

function onPrint(data: { index: number; value: number | null; }[]) {
}

function onClose() {
  useTrackEvent('model_test_close', {
    scale: props.name
  })

  result.value = undefined;
  emit('close')
}
</script>

<template>
  <ModelBase :is-open="isOpen" @close="onClose" id="scale" class="w-[700px] max-h-[550px] overflow-hidden">
    <h4 class="text-xl ml-2 mt-2 mb-6">{{ name }}</h4>
    <div class="absolute top-4 right-16 flex flex-col gap-1 w-fit text-sm">
      <span>Use &#8592 / &#8594 keys to select {{ type === 'binary' ? "True / False" : "1/2/3/4/5" }}</span>
      <span>Use &#8593 / &#8595 keys to move backward / forward</span>
      <span v-if="type === 'binary'">Use T/F keys to select True / False</span>
      <span v-else-if="type === 'pentanary'">Use 1/2/3/4/5 keys to select 1/2/3/4/5</span>
    </div>
    <Splide ref="splide" :options="dataSplideOption" tag="div" :has-track="false" @splide:pagination:updated="onMove">
      <SplideTrack>
        <SplideSlide v-for="(groups, slideIndex) in choicesSlides" :key="`choice-${slideIndex}`"
          class="grid grid-flow-col grid-rows-2 gap-6 justify-items-center w-full"
          :class="type == 'binary' ? 'grid-cols-3' : 'grid-cols-2'">
          <div v-for="(group, groupIndex) in groups" :key="groupIndex" class="flex flex-col gap-2">
            <template v-for="{ index, value } in group" :key="index">
              <InputChoice :options="options" :index="index" :value="value ?? undefined"
                :is-selected="currentChoiceIndex === index - 1" :is-invalid="invalidChoiceIndex === index - 1"
                @click="result = undefined" @update="(value) => onInput(index - 1, value)" />
            </template>
          </div>
        </SplideSlide>
        <SplideSlide v-if="result">
          <div class="relative max-h-[408px] overflow-y-scroll">
            <table class="rounded-md w-[calc(100%-0.5rem)] table-auto overflow-hidden">
              <tbody class="bg-dark-400">
                <tr v-for="{ name, value }, index in result" :key="name">
                  <td class="border-black p-2 pr-8 capitalize" :class="{ 'border-b': index !== result.length - 1 }">
                    {{ name.replaceAll('-', ' ') }}
                  </td>
                  <td class="border-black border-x p-2 pr-8" :class="{ 'border-b': index !== result.length - 1 }">
                    {{ value }}
                  </td>
                  <td class=" border-black p-2 pr-8" :class="{ 'border-b': index !== result.length - 1 }">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SplideSlide>
      </SplideTrack>
      <div class="splide__arrows flex justify-between mt-4">
        <button class="splide__arrow splide__arrow--prev">
          <NuxtIcon name="chevron-bold" />
        </button>
        <button v-show="!isLastSlide" class="splide__arrow splide__arrow--next transform rotate-180">
          <NuxtIcon name="chevron-bold" />
        </button>
        <BaseButton v-show="isLastSlide && !result" :is-loading="isLoading" title="Calculate" size="M"
          class="!px-3 !py-1 transition-[width] ease-in-out duration-300" @click="onCalculate(choices)" />
        <BaseButton v-show="isLastSlide && result" title="Print" size="M"
          class="!px-3 !py-1 transition-[width] ease-in-out duration-300" @click="onPrint(choices)" />
      </div>
    </Splide>
  </ModelBase>
</template>

<style scoped>
:deep(.pagination) {
  @apply absolute left-1/2 bottom-0 flex gap-1 h-[10px] -translate-x-1/2;
}

:deep(.pagination)>li {
  @apply flex justify-center items-center;
}

:deep(.pagination-page) {
  @apply rounded-full w-[6px] h-[6px] bg-white transition-colors duration-300;
}

:deep(.pagination-page.is-active) {
  @apply w-[10px] h-[10px] bg-primary-500;
}

:deep(.arrows) {
  @apply text-secondary-400
}
</style>
