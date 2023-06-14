<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
  title: string,
  name: string,
  value?: string,
}>()

const { value, errors } = useField(props.name, validateField);

function validateField(value: string) {
  value = value?.trim()

  if (!value)
    return `${props.title} is required`;

  /*   if (!isNaN(Date.parse(value)))
      return "Enter a valid Date"
   */
  return true;
}
</script>

<!-- <template>
  <div class="flex flex-col gap-2">
    <label :for="name">{{ title }}</label>
    <div
      class="flex gap-2 focus-within:outline focus-within:outline-2 focus-within:outline-primary-400 rounded-2xl py-2 px-4 w-full h-11 bg-light-400 dark:bg-dark-400 text-sm text-light-500 dark:text-light-500/60">
      <NuxtIcon name="cake" class="text-[24px]" />
      <input type="text" :name="name" placeholder="DD-MM-YYYY" v-model="value" v-bind="$attrs"
        class="w-full bg-transparent outline-none">
    </div>
    <span class="text-alert-500 text-sm font-semi-bold">{{ errors[0] }}</span>
  </div>
</template>
 -->
<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      class="flex gap-2 focus-within:outline focus-within:outline-2 focus-within:outline-primary-400 rounded-2xl py-2 px-4 w-full h-11 bg-light-400 dark:bg-dark-400 text-sm text-light-500 dark:text-light-500/60">
      <NuxtIcon name="cake" class="text-[24px] " />
      <input type="date" :name="name" placeholder="DD-MM-YYYY" v-model="value" v-bind="$attrs"
        class="w-full bg-transparent outline-none">
    </div>
    <span v-show="errors.length" class="text-alert-500 text-sm font-semi-bold">{{ errors[0] }}</span>
  </div>
</template>