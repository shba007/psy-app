<script setup lang="ts">
import { ScaleType } from '~/utils/models';

const props = withDefaults(defineProps<{
  type: ScaleType,
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

const choices = computed(() => {
  if (props.type === 'binary')
    return [
      { label: "false", value: 0 },
      { label: "true", value: 1 },
    ]
  else if (props.type === 'pentanary')
    return [
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
    ]
})
</script>

<template>
  <div class="w-max">
    <label class="inline-flex justify-center rounded-full py-1 w-[50px]"
      :class="isInvalid && selectedChoice === undefined ? 'bg-alert-500' : (isSelected ? 'bg-secondary-500' : (selectedChoice !== undefined ? 'bg-success-500' : 'bg-black'))">
      {{ index }}
    </label>
    <div class="inline-flex gap-[6px] ml-2">
      <span v-for="{ label, value } in choices" class="inline-flex justify-center rounded-full px-3 py-1 cursor-pointer"
        :class="[(selectedChoice == value ? 'bg-primary-500' : 'bg-black'), { 'w-[66px]': type === 'binary' }, { 'w-[36px]': type === 'pentanary' }]"
        @click="emit('update', value)">
        <label for="false" class="capitalize cursor-pointer">{{ label }}</label>
      </span>
    </div>
  </div>
</template>