<script setup lang="ts">
const props = defineProps<{
  name: string,
  content: string,
  selected: boolean,
}>()
const emit = defineEmits<{
  (event: 'update:value', value: string | undefined): void
}>()

const value = ref(props.selected);
const propsUpdated = ref(false)

watch(() => props.selected, () => {
  value.value = props.selected
  propsUpdated.value = true
})

watch(value, () => {
  if (!propsUpdated.value)
    emit('update:value', props.content);

  propsUpdated.value = false
});
</script>

<template>
  <span class="relative cursor-pointer">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#outer_layer)">
        <circle cx="14" cy="14" r="12" :class="selected ? 'fill-primary-500' : 'fill-light-500 dark:fill-black'" />
      </g>
      <g filter="url(#inner_layer)">
        <circle cx="14" cy="14" :r="selected ? 5.25 : 8" class="fill-white dark:fill-dark-600" />
      </g>
      <defs>
        <filter id="outer_layer" x="2.00012" y="2" width="24" height="24" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.375 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2480_8220" />
        </filter>
        <filter id="inner_layer" x="4.74988" y="4.75" width="18.5" height="18.5" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.375 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2480_8220" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2480_8220" result="shape" />
        </filter>
      </defs>
    </svg>
    <input type="radio" :name="name" :value="content" v-model="value"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer" />
  </span>
</template>