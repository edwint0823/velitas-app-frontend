<template>
  <Loading/>
  <div v-if="isMobile" class="bg-gradient-to-b from-green-400 to-sky-300 ">
    <MobileMenu/>
    <main class="p-2 flex-grow" style="min-height: 100vh">
      <Breadcrumbs/>
      <div class="bg-white/80 shadow-blur rounded-2xl p-5">
        <router-view/>
      </div>
    </main>
  </div>
  <div v-else class="common-layout bg-gradient-to-b from-green-400 to-sky-300 ">
    <DesktopMenu/>
    <main class="p-4 flex-grow" style="min-height: 100vh">
      <Breadcrumbs/>
      <div class="bg-white/80 shadow-blur rounded-2xl p-5">
        <router-view/>
      </div>
      <div>
        <a href="https://api.whatsapp.com/send/?phone=573155680091&text=Hola%20como%20estas&type=phone_number&app_absent=0"
           target="_blank"
           rel="noopener noreferrer" v-tooltip="'Chatea con nosotros'"
           class="p-button font-bold floating-button bg-green-500 rounded-full p-3 drop-shadow-xl">
          <i class="pi pi-whatsapp text-3xl text-white"/>
        </a>
      </div>
    </main>
  </div>
</template>
<script setup>
import {helper} from '../utils/helper.js'
import DesktopMenu from "@/components/Menu/DesktopMenu.vue";
import MobileMenu from "@/components/Menu/MobileMenu.vue";
import Breadcrumbs from "@/components/Menu/Breadcrumbs.vue";
import Loading from "@/components/general/Loading.vue";
import {computed} from "vue";


const isMobile = computed(() => {
  return helper.isMobileDevice()
})

</script>
<style scoped>
.floating-button {
  position: fixed !important;
  bottom: 19px;
  right: 19px;
  z-index: 10050;
}
</style>