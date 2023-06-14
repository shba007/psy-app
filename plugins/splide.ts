import VueSplide from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css/core';

import '@splidejs/splide-extension-grid';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSplide);
})
