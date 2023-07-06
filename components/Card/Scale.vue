<script setup lang="ts">
// import { Scale } from '~/utils/models';

interface Scale {
  name: string;
  type: 'binary' | 'pentanary'
  count: number;
  subScales: string[];
  expiresAt: string | null;
  updatedAt: string;
  publishedAt: string;
}

const props = defineProps<Scale>()
const emit = defineEmits<{
  (event: 'openTest'): void,
  (event: 'openPayment'): void
}>()

const expiresIn = useTimeAgo(() => props.expiresAt ?? "", {
  messages: {
    invalid: 'Invalid Date',
    past: 'Recharge',
    justNow: 'Recharge',
    future: (n: any) => n.match(/\d/) ? `${n} Left` : n,
    month: (n: number) => `${n} month${n > 1 ? 's' : ''}`,
    year: (n: number) => `${n} year${n > 1 ? 's' : ''}`,
    day: (n: number) => `${n} day${n > 1 ? 's' : ''}`,
    week: (n: number) => `${n} week${n > 1 ? 's' : ''}`,
    hour: (n: number) => `${n} hour${n > 1 ? 's' : ''}`,
    minute: (n: number) => `${n} min`,
    second: (n: number) => `${n} sec`,
  }
})
const updatedIn = useTimeAgo(() => props.updatedAt, {
  messages: {
    invalid: 'Invalid Date',
    past: (n: any) => n.match(/\d/) ? `Updated ${n} ago` : n,
    justNow: 'Just Now',
    future: (n: any) => n.match(/\d/) ? `Next Update In ${n}` : n,
    month: (n: number) => `${n} month${n > 1 ? 's' : ''}`,
    year: (n: number) => `${n} year${n > 1 ? 's' : ''}`,
    day: (n: number) => `${n} day${n > 1 ? 's' : ''}`,
    week: (n: number) => `${n} week${n > 1 ? 's' : ''}`,
    hour: (n: number) => `${n} hour${n > 1 ? 's' : ''}`,
    minute: (n: number) => `${n} min`,
    second: (n: number) => `${n} sec`,
  }
})

function messageColor(date: string | Date | null) {
  if (date === null)
    return 'text-alert-400'

  if (typeof date === 'string')
    date = new Date(date)

  const deltaHour = (date.getTime() - new Date().getTime()) / (1000 * 60 * 60)

  if (deltaHour < 24)
    return 'text-alert-400'
  else if (deltaHour < 72)
    return 'text-warning-400'
  else
    return 'text-primary-400'
}

function onOpenTest() {
  useTrackEvent('model_test_open', {
    scale: props.name
  })
  emit('openTest')
}

const isRecentlyPublished = computed(() => new Date().getTime() - new Date(props.publishedAt).getTime() < 1000 * 60 * 60 * 24)
</script>

<template>
  <div class="pr-[5px]">
    <div
      class="relative grid gap-y-3 grid-rows-[repeat(2,min-content)_1fr_min-content] grid-cols-[repeat(2,auto)] rounded-2xl p-4 min-w-[272px] max-w-[300px] aspect-square bg-dark-500">
      <!--  <div class="self-start justify-self-end flex gap-2 items-center row-start-1 col-start-2 col-span-1 w-fit h-fit">
        <BaseChips :title="!!expiresAt ? expiresIn : 'Recharge'" :class="messageColor(expiresAt)" class="cursor-pointer"
          @click="emit('openPayment')" />
        <BaseButton icon="flash" :rounded="true" size="S" @click="emit('openPayment')" />
      </div> -->
      <h6 class="col-start-1 h-fit text-lg">{{ name }}</h6>
      <BaseRibbon :title="isRecentlyPublished ? 'new' : null" class="absolute -right-[5px] top-14 bg-dark-400" />
      <div class="col-start-1 col-span-2 flex gap-2 h-fit text-sm opacity-50">
        <span>Sub Scales {{ subScales.length }}</span>
        <span>&#x2022</span>
        <span class="capitalize">{{ type }}</span>
        <span>&#x2022</span>
        <span>Item {{ count }}</span>
      </div>
      <div class="relative col-start-1 col-span-2 h-full">
        <div class="flex flex-wrap gap-2 max-h-[128px] overflow-y-auto">
          <BaseChips v-for="subScale in subScales" :key="subScale" :title="subScale.replaceAll('-', ' ')"
            class="capitalize cursor-text" />
        </div>
      </div>
      <span class="row-start-4 col-start-1 col-span-2 self-center w-fit text-sm opacity-50">{{ updatedIn }}</span>
      <BaseButton class="row-start-4 col-start-2 justify-self-end self-end hover:bg-primary-400" size="S" :rounded="true"
        icon="keyboard" title="Start" @click="onOpenTest" />
    </div>
  </div>
</template>