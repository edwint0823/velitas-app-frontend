<template>
  <Loading />
  <div v-if="isMobile" class="bg-gradient-to-b from-green-400/80 to-sky-300/80">
    <MobileMenu />
    <main class="flex-grow p-2" style="min-height: 100vh">
      <Breadcrumbs />
      <div class="shadow-blur rounded-2xl bg-white/80 p-0 lg:p-3 xl:p-5 2xl:p-5">
        <router-view />
      </div>
      <div>
        <a
          href="https://api.whatsapp.com/send/?phone=573143039143&text=Hola%20Deseo%20mas%20información%20de%20velitas&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          v-tooltip="'Chatea con nosotros '"
          class="p-button floating-button rounded-full bg-green-500 p-3 font-bold drop-shadow-xl"
        >
          <i class="pi pi-whatsapp text-3xl text-white" />
        </a>
      </div>
    </main>
  </div>
  <div v-else class="common-layout min-w-screen bg-gradient-to-b from-green-400/80 to-sky-300/80">
    <DesktopMenu />
    <main class="w-full flex-grow p-4" style="min-height: 100vh">
      <Breadcrumbs />
      <div class="shadow-blur rounded-2xl bg-white/80 p-5">
        <router-view />
      </div>
      <div>
        <a
          href="https://api.whatsapp.com/send/?phone=573143039143&text=Hola%20Deseo%20mas%20información%20de%20velitas&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          v-tooltip="'Chatea con nosotros '"
          class="p-button floating-button rounded-full bg-green-500 p-3 font-bold drop-shadow-xl"
        >
          <i class="pi pi-whatsapp text-3xl text-white" />
        </a>
      </div>
    </main>
  </div>
</template>
<script setup>
import { helper } from "../utils/helper.js";
import DesktopMenu from "@/components/Menu/DesktopMenu.vue";
import MobileMenu from "@/components/Menu/MobileMenu.vue";
import Breadcrumbs from "@/components/Menu/Breadcrumbs.vue";
import Loading from "@/components/general/Loading.vue";
import { computed } from "vue";

const isMobile = computed(() => {
  return helper.isMobileDevice();
});
</script>
<style scoped>
.floating-button {
  position: fixed !important;
  bottom: 19px;
  right: 19px;
  z-index: 10050;
}
</style>
