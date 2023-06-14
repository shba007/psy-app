<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
  title: string,
  name: string,
}>()

const genders = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Other', value: 'other' },
];

const { value, errors } = useField(props.name, validateField);

function validateField(value: string) {
  value = value?.trim()

  if (!value)
    return `${props.title} is required`;

  if (!isNaN(Date.parse(value)))
    return "Enter a valid Date"

  return true;
}

function onUpdate(updatedValue: string | undefined) {
  if (updatedValue)
    value.value = updatedValue
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="name">{{ title }}</label>
    <ul class="flex justify-between gap-2">
      <li class="flex gap-1" v-for="gender in genders">
        <InputRadio :selected="gender.value === value" :name="name" :content="gender.value" @update:value="onUpdate" />
        <label :for="name">{{ gender.title }}</label>
      </li>
    </ul>
    <span class="text-alert-500 text-sm font-semi-bold">{{ errors[0] }}</span>
  </div>
</template>