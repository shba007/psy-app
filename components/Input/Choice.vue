<script setup lang="ts">
const props = defineProps<{
  index: number,
  value?: boolean
}>()
const emit = defineEmits<{
  (event: 'update', value: boolean): void
}>()
const selectedChoice = ref<boolean>(props.value)

watch(selectedChoice, (value) => {
  emit('update', value)
})
</script>

<template>
  <div class="w-max">
    <label class="inline-flex justify-center rounded-full py-1 w-[50px]"
      :class="selectedChoice !== undefined ? 'bg-secondary-600' : 'bg-black'">{{ index }}</label>
    <span class="inline-flex justify-center ml-2 mr-[6px] rounded-full px-3 py-1 w-[66px] cursor-pointer"
      :class="selectedChoice == true ? 'bg-primary-500' : 'bg-black'" @click="selectedChoice = true">
      <!-- <input type="radio" :id="`${index}-true`" :value="true" v-model="selectedChoice" class="w-full h-full"> -->
      <label for="true" class="cursor-pointer">True</label>
    </span>
    <span class="inline-flex justify-center rounded-full px-3 py-1 w-[66px] cursor-pointer"
      :class="selectedChoice == false ? 'bg-primary-500' : 'bg-black'" @click="selectedChoice = false">
      <!-- <input type="radio" :id="`${index}-false`" :value="true" v-model="selectedChoice" class="hidden w-full h-full"> -->
      <label for="false" class="cursor-pointer">False</label>
    </span>
  </div>
</template>