<template>
  <header class="mb-4 flex">
    <Breadcrumb :home="home" :model="breadcrumb_items"
                class="w-full p-5 text-dark bg-surface-200 dark:text-white dark:bg-surface-900 rounded-lg">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{name: item.route}" custom>
          <a :href="href" @click="navigate">
            <span :class="[item.icon, 'text-color']"/>
            <span class="text-primary font-semibold text-sm lg:text-base xl:text-base 2xl:text-base ">{{
                item.label
              }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-color text-sm lg:text-base xl:text-base 2xl:text-base ">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
    <div class="ml-2 w-[9rem]" v-if="!isLoggedIn && !isMobile">
      <div class="bg-surface-200 dark:bg-surface-900 rounded-lg p-4 my-auto">
        <Avatar shape="circle">
          <template #icon>
            <i class="pi pi-sign-in text-slate-950 dark:text-slate-50"></i>
          </template>
        </Avatar>
        <span class="text-slate-950 dark:text-slate-50 ">{{ isLoggedIn ? 'Salir' : "Ingresar" }}</span>
      </div>
    </div>
  </header>
</template>
<script setup>

import {computed, ref} from "vue";
import {useMainStore} from '@/store/main.store.js'
import {helper} from "@/utils/helper.js";

const home = ref({
  icon: 'pi pi-home',
  route: 'dashboard'
});
const mainStore = useMainStore()

const isLoggedIn = computed(() => {
  // Todo: agregar storage para usuario loguedo
  return true
})
const isMobile = computed(() => {
  return helper.isMobileDevice()
})
const breadcrumb_items = computed(() => {
  return mainStore.getBreadcrumbs
})
</script>