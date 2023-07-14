<script setup lang="ts">
import { SubscribedScale } from "utils/models";
import doc from "~~/assets/images/documents.svg?raw";

useHead({
  title: 'Scanner',
})

const scale = ref<{
  name: string, type: 'binary' | 'pentanary', count: number,
  options: {
    name: string;
    value: number;
  }[],
  choices: {
    index: number;
    value: number | null;
  }[]
} | null>(null)
const isLoading = ref(false)
const openModel = ref<'download' | 'scale' | null>(null)

const dropZoneRef = ref<HTMLDivElement>()
const documents = ref<string[]>([])

async function convertFileToDataURL(files: File[]) {
  return await Promise.all(files.map((file) => {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(file);
    })
  }))
}

async function convertImagesToObjectURL(imageDatas: File[] | string[]): Promise<string[]> {
  return await Promise.all(imageDatas.map((imageData) => {
    // Create a blob from binary image data
    const blob = new Blob([imageData], { type: 'image/jpeg' });

    // Generate object URL
    const objectURL = URL.createObjectURL(blob);
    return objectURL
  }))
}

async function uploadFile(files: File[] | null) {
  if (!files)
    return

  const allowedFileTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  const allAllowed = files.every((file) =>
    allowedFileTypes.includes(file.type)
  );

  if (!allAllowed)
    throw new Error("Some files are not allowed")
  else if (!(files.length >= 1 && files.length <= 2))
    throw new Error("Min 1 and Max 2 files allowed at a time")

  documents.value = await convertImagesToObjectURL(files)
  // TODO: Start scan
  isLoading.value = true
  try {
    const result = await $fetchAPI('/api/scale/scan', {
      method: 'POST',
      body: await convertFileToDataURL(files)
    })

    documents.value = result.highlights
    scale.value = result.data

  } catch (error) {
    console.error("Fetch API Scale/Scan", error);
  }
  isLoading.value = false
}

const { open: openFileDialog, reset: fileDialogReset, onChange } = useFileDialog()

onChange((files) => {
  const fileIndexes = Array.from({ length: files?.length ?? 0 }, (_, index) => index);
  const fileArray = fileIndexes.map((index) => files?.item(index) ?? null).filter(file => !!file) as File[]

  useTrackEvent('upload_files', {
    count: fileArray.length
  })
  uploadFile(fileArray)
})

const { isOverDropZone } = useDropZone(dropZoneRef, uploadFile)

function onDownload() {
  useTrackEvent('model_download_open')
  openModel.value = 'download'
}

function onReset() {
  useTrackEvent('scan_reset')
  documents.value = []
  fileDialogReset()
}

function onContinue() {
  useTrackEvent('scan_continue')
  openModel.value = 'scale'
}

const { pending, error, data: scales, execute } = await useAsyncData<SubscribedScale[]>('scales', async () =>
  $fetchAPI('/api/scale', {
    method: 'GET',
  }), { immediate: false })

onBeforeMount(execute)
</script>

<template>
  <main class="relative flex items-center justify-center w-full h-full">
    <!-- <Toast /> -->
    <div ref="dropZoneRef" v-if="!documents.length" class="upload rounded-lg px-20 pb-16 w-fit transition-colors"
      :class="{ 'bg-dark-400': isOverDropZone }">
      <div v-html="doc" />
      <div class="mx-auto flex flex-col gap-3 items-center">
        <BaseButton title="Upload Documents" size="S" icon="upload" class="!text-base" @click="openFileDialog" />
        <span class="uppercase text-sm">or</span>
        <BaseButton title="Download Templates" size="S" icon="download" class="!text-base !bg-dark-500 hover:!bg-dark-600"
          @click="onDownload" />
      </div>
    </div>
    <div v-else class="relative w-full h-[504px] text-[24px] ">
      <NuxtIcon v-if="isLoading" name="loader" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30" />
      <div class="mx-auto py-5 w-fit h-full" :class="{ 'blur-sm': isLoading }">
        <div v-if="isLoading" class="absolute left-1 right-1 top-1 bottom-1 bg-dark-400/60 z-20 !text-white" />
        <img v-for=" document in documents" :src="document" class="h-full" />
      </div>
    </div>
    <div v-if="documents.length > 0 && !isLoading" class="absolute left-4 right-4 bottom-4 flex justify-between">
      <BaseButton title="Reset" size="S" icon="chevron-bold" class="!text-base w-[110px] justify-center"
        @click="onReset" />
      <BaseButton title="Continue" size="S" icon="chevron-bold-right" class="flex-row-reverse !pl-[14px] !pr-3 !text-base"
        @click="onContinue" />
    </div>
    <ModelDownload v-if="openModel === 'download'" :is-open="openModel === 'download'" :scales="scales"
      @close="openModel = null" />
    <ModelScale v-if="openModel === 'scale' && !!scale" :is-open="openModel === 'scale' && !!scale" :name="scale.name"
      :type="scale.type" :count="scale.count" :options="scale.options" :choices="scale.choices"
      @close="scale = null; openModel = null; onReset()" />
  </main>
</template>

<style scoped>
.upload {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23FFFFFFFF' stroke-width='3' stroke-dasharray='6%2c 6' stroke-dashoffset='16' stroke-linecap='round'/%3e%3c/svg%3e");
}
</style>