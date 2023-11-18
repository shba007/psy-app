<script setup lang="ts">
const props = withDefaults(defineProps<{
  options: { name: string, value: number }[],
  index: number,
  value?: number,
  isSelected?: boolean
  isInvalid?: boolean
}>(), {
  isSelected: false,
  isInvalid: false
})
const emit = defineEmits<{
  (event: 'update', value: number): void
}>()

const selectedChoice = computed(() => props.value)
</script>

<template>
  <div class="w-max text-white">
    <label class="inline-flex justify-center rounded-full py-1 w-[50px]"
      :class="isInvalid && selectedChoice === undefined ? 'bg-alert-500' : (isSelected ? 'bg-secondary-500' : (selectedChoice !== undefined ? 'bg-success-500' : 'bg-white text-black dark:bg-black dark:text-white'))">
      {{ index }}
    </label>
    <div class="inline-flex gap-[6px] ml-2" :class="{ 'flex-row-reverse': options.length === 2 }">
      <span v-for="{ name, value } in options" class="inline-flex justify-center rounded-full px-3 py-1 cursor-pointer"
        :class="[(selectedChoice == value ? 'bg-primary-500' : 'bg-white text-black dark:bg-black dark:text-white'), { 'w-[66px]': options.length === 2 }, { 'w-[36px]': options.length === 5 }]"
        @click="emit('update', value)">
        <label for="false" class="capitalize cursor-pointer">{{ name }}</label>
      </span>
    </div>
  </div>
</template>