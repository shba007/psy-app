<script setup lang="ts">
import { Options, Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';

const props = defineProps<{ isOpen: boolean, name?: string, count?: number }>()
const emit = defineEmits<{
  (event: 'close',): void,
  (event: 'calculate', data: { index: number; value: boolean | null; }[]): void
}>()

const dataSplideOption: Options = {
  arrows: true,
  pagination: true,
  gap: '1rem',
  wheel: true,
  releaseWheel: true,
  classes: {
    pagination: 'pagination',
    page: 'pagination-page',
  },
};

const splide = ref();
const isLoading = ref(false)
const showCalculate = ref(false)

const choices = ref<{ index: number; value: boolean | null; }[]>([])

watch(() => props.count, () => {
  choices.value = new Array(props.count)
    .fill(0)
    .map((_, index) =>
      ({ index: index + 1, value: null }))
})

const choicesSlides = computed(() => {
  const slides = [];
  const groups = []

  for (let choiceIndex = 0; choiceIndex < choices.value.length; choiceIndex += 5) {
    groups.push(choices.value.slice(choiceIndex, Math.min(choiceIndex + 5, choices.value.length)))
  }

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 6) {
    slides.push(groups.slice(groupIndex, Math.min(groupIndex + 6, groups.length)))
  }

  return slides
})

watch(choices, () => {
  result.value = undefined
})

const result = ref<{ name: string, value: number }[]>()

const resultSlides = computed(() => {
  if (!result.value)
    return

  const slides = [];

  for (let itemIndex = 0; itemIndex < result.value.length; itemIndex += 10) {
    slides.push(result.value.slice(itemIndex, Math.min(itemIndex + 10, result.value.length)))
  }

  return slides
})

function onMove(_slide: any, list: { items: string | any[]; }, _prev: any, curr: { page: number; }) {
  showCalculate.value = !result.value && (curr.page === list.items.length - 1)
}

async function onCalculate(data: { index: number; value: boolean | null; }[]) {
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

    setTimeout(() => {
      splide.value.go('>')
    }, 300)
  } catch (error) {


  }

  isLoading.value = false
}

function onInput(index: number, value: boolean) {
  choices.value[index - 1].value = value
}
</script>

<template>
  <ModelBase :is-open="isOpen" @close="result = undefined; emit('close')" id="scale" class="w-[700px]">
    <!-- <form method="dialog"> -->
    <h4 class="text-lg mb-4">{{ name }}</h4>
    <Splide ref="splide" :options="dataSplideOption" tag="div" :has-track="false" @splide:pagination:updated="onMove">
      <SplideTrack>
        <SplideSlide v-for="(groups, slideIndex) in choicesSlides" :key="`choice-${slideIndex}`"
          class="grid grid-flow-col grid-rows-2 grid-cols-3 gap-6 w-full">
          <div v-for="(group, groupIndex) in groups" :key="groupIndex" class="flex flex-col gap-2">
            <template v-for="{ index, value } in group">
              <InputChoice :index="index" :value="value ?? undefined" @click="result = undefined"
                @update="(value) => onInput(index, value)" />
            </template>
          </div>
        </SplideSlide>
        <template v-if="result">
          <SplideSlide v-for="(slide, slideIndex) in resultSlides" :key="`result-${slideIndex}`">
            <table class="table-auto w-full rounded-md overflow-hidden ">
              <tbody class="bg-dark-400">
                <tr v-for="{ name, value }, index in slide">
                  <td class="border-black p-2 pr-8 capitalize" :class="{ 'border-b': index !== slide.length - 1 }">
                    {{ name.replaceAll('-', ' ') }}
                  </td>
                  <td class="border-black border-x p-2 pr-8" :class="{ 'border-b': index !== slide.length - 1 }">
                    {{ value }}
                  </td>
                  <td class=" border-black p-2 pr-8" :class="{ 'border-b': index !== slide.length - 1 }">
                  </td>
                </tr>
              </tbody>
            </table>
          </SplideSlide>
        </template>
      </SplideTrack>
      <div class="splide__arrows flex justify-between mt-4">
        <button class="splide__arrow splide__arrow--prev">
          <NuxtIcon name="chevron-bold" />
        </button>
        <button v-show="!showCalculate" class="splide__arrow splide__arrow--next transform rotate-180">
          <NuxtIcon name="chevron-bold" />
        </button>
        <BaseButton v-show="showCalculate" :is-loading="isLoading" title="Calculate" size="M"
          class="!px-3 !py-1 transition-[width] ease-in-out duration-300" @click="onCalculate(choices)" />
      </div>
    </Splide>
    <!-- </form> -->
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
  /* drop-shadow-[0_0px_2px_rgba(0,0,0,0.5)] */
  @apply rounded-full w-[6px] h-[6px] bg-white transition-colors duration-300;
}

:deep(.pagination-page.is-active) {
  /* drop-shadow-[0_0px_4px_rgba(37,99,235,0.2)] */
  @apply w-[10px] h-[10px] bg-primary-500;
}

:deep(.arrows) {
  @apply text-secondary-400
}
</style>
