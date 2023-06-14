<script setup lang="ts">
import { useField } from 'vee-validate';

const props = defineProps<{
  name: string,
}>()

const inputs = ref<HTMLInputElement[]>([])
const { prev: focusPrev, next: focusNext, index: currentIndex } = useCycleFocus(inputs, { isLoop: false })
const { current: keypress } = useMagicKeys()

const { value: code, errors } = useField(props.name, validateField, { initialValue: [...Array(6).fill(null)] });

// TODO: Fix detected a possible deep change
function validateField(value: (number | null)[]) {
  return true;
}

function validateBeforeInput(event: any, index: number) {
  const data = [...code.value]
  data[index] = null
  code.value = data
  if (keypress.has('backspace'))
    focusPrev()
}

function validateInput(event: any, index: number) {
  if (event.data) {
    const data = [...code.value]
    data[index] = parseInt(event.data)
    code.value = data
    focusNext()
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 mx-auto w-fit">
    <span class="inline-flex gap-2">
      <input ref="inputs" v-for="index of range(6)" @focus="currentIndex = index" :value="code[index]"
        @beforeinput="validateBeforeInput($event, index)" @input="validateInput($event, index)" type="number"
        class="border-b-2 border-black/30 w-10 text-center bg-transparent outline-none"
        :class="{ 'border-black/100': currentIndex > index, 'border-primary-500/80': currentIndex === index }" />
    </span>
    <!-- <span class="text-alert-500 text-sm font-semi-bold">{{ errors[0] }}</span> -->
  </div>
</template>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>