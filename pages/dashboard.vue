<script setup lang="ts">
import { Options, Splide, SplideTrack, SplideSlide } from '@splidejs/vue-splide';
import { Grid } from '@splidejs/splide-extension-grid';
import { SubscribedScale } from '~/utils/models';

definePageMeta({
  middleware: "auth"
})

const splideOption: Options = {
  arrows: true,
  pagination: true,
  gap: '1rem',
  classes: {
    pagination: 'pagination',
    page: 'pagination-page',
  },
  grid: {
    rows: 2,
    cols: 4,
    gap: {
      row: '0.5rem',
      col: '0.5rem',
    },
  }, breakpoints: {
    1280: {
      grid: {
        cols: 3
      }
    },
    1024: {
      grid: {
        cols: 2
      }
    }
  }
};
const splide = ref()

const { pending, error, data: scales, execute, refresh } = await useAsyncData<SubscribedScale[]>('scales', async () =>
  $fetchAPI('/api/scale', {
    method: 'GET',
  }), { immediate: false })

const selectedScaleName = ref<string | null>(null)
const selectedScale = computed(() => selectedScaleName.value ? scales.value?.find(({ name }) => name === selectedScaleName.value) : undefined)

const openedModel = ref<'scale' | 'payment' | null>(null)

onBeforeMount(execute)
</script>

<template>
  <main class="relative flex flex-col">
    <section class="relative">
      <h2 class="mb-2 text-lg">Tests</h2>
      <div v-if="pending" class="relative flex gap-2 justify-center items-center h-[75vh]">
        <NuxtIcon name="loader" class="text-[24px]" />
        Loading
      </div>
      <div v-else-if="error" class="relative flex justify-center items-center h-[75vh]">
        Error
      </div>
      <Splide v-else ref="splide" :options="splideOption" tag="div" :has-track="false" :extensions="{ Grid }">
        <SplideTrack>
          <SplideSlide v-for="{ name, type, count, subScales, expiresAt, updatedAt, publishedAt } in scales" :key="name"
            class="w-full">
            <CardScale :name="name" :type="type" :count="count" :sub-scales="subScales" :expires-at="expiresAt"
              :updated-at="updatedAt" :published-at="publishedAt"
              @open-test="selectedScaleName = name; openedModel = 'scale'"
              @open-payment="selectedScaleName = name; openedModel = 'payment'" />
          </SplideSlide>
        </SplideTrack>
        <div class="splide__arrows flex justify-between mt-4 ml-auto w-16">
          <button class="splide__arrow splide__arrow--prev">
            <NuxtIcon name="chevron-bold" />
          </button>
          <button class="splide__arrow splide__arrow--next transform rotate-180">
            <NuxtIcon name="chevron-bold" />
          </button>
        </div>
      </Splide>
      <!--  
      <div class="flex gap-6 flex-wrap">
      </div> 
      -->
    </section>
    <!--  <section>
      <h2>Reports</h2>
    </section> -->
    <ModelScale v-if="openedModel === 'scale' && selectedScale" :is-open="openedModel === 'scale'"
      :name="selectedScale.name" :type="selectedScale.type" :count="selectedScale.count" :labels="selectedScale.labels"
      @close="selectedScaleName = null; openedModel = null" />
    <ModelPayment v-else-if="openedModel === 'payment' && selectedScale" :is-open="openedModel === 'payment'"
      :scales="scales ?? []" :selected-scale="selectedScale.name"
      @close="selectedScaleName = null; openedModel = null; refresh()" />
  </main>
</template>

<style scoped>
:deep(.pagination) {
  @apply absolute right-6 bottom-1 flex gap-1 h-[10px];
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
</style>
