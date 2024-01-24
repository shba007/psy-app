<script setup lang="ts">
import { type SubscribedScale } from '~/utils/models';

const props = defineProps<{
  isOpen: boolean,
  scales: SubscribedScale[] | null
}>()
const emit = defineEmits<{
  (event: 'close'): void,
}>()

const selectedScales = ref(new Set<string>([]))

function toggle(scale: string) {
  selectedScales.value.has(scale) ? selectedScales.value.delete(scale) : selectedScales.value.add(scale)
}

function onMassSelect(type: 'select' | 'deselect') {
  if (!props.scales)
    return
  props.scales.forEach(({ name }) => {
    if (type === 'select')
      selectedScales.value.add(name)
    else
      selectedScales.value.delete(name)
  })
}

function onDownload() {
  useTrackEvent('download_templates', {
    scales: Array.from(selectedScales.value.keys())
  })

  for (const scale of Array.from(selectedScales.value.keys())) {
    const link = document.createElement('a');

    link.href = `/template/${scale}.pdf`;
    link.download = `${scale}.pdf`;

    link.click();
  }
}

function onClose() {
  useTrackEvent('model_download_close')

  emit('close')
}

</script>

<template>
  <ModelBase :is-open="isOpen" @close="onClose" id="download"
    class="grid grid-rows-[repeat(3,auto)] grid-cols-[repeat(2,auto)] gap-6 w-[500px] h-[375px] text-black dark:text-white">
    <h6 class="row-start-1 col-start-1 text-lg">Choose Scales to Download</h6>
    <div class="row-start-2 col-start-1 flex gap-3 flex-wrap">
      <BaseChips v-for="{ name } in scales" :title="name" class="!px-4 !py-1 cursor-pointer"
        :class="{ 'bg-primary-400': selectedScales.has(name) }" @click="toggle(name)" />
    </div>
    <div class="relative row-start-2 col-start-2 flex flex-col gap-3">
      <BaseButton size="M" :rounded="true" title="Select All" class="!py-1 !w-full" @click="onMassSelect('select')" />
      <BaseButton size="M" :rounded="true" title="Deselect All" class="!py-1 !w-full !bg-dark-400"
        @click="onMassSelect('deselect')" />
    </div>
    <BaseButton size="M" :rounded="true" title="Download"
      class="self-end justify-self-end row-start-3 col-start-2 !py-1 h-fit" @click="onDownload" />
  </ModelBase>
</template>