<template>
  <aside v-if="isLoggedIn">
    <MegaMenu :model="isLoggedIn ? items: []" orientation="vertical">
      <template #start>
        <div class="flex items-center flex-col mb-5">
          <img src="../../../public/images/logo_app.png" alt="" class="w-1/2"/>
          <span class="font-semibold dark:text-white text-surface-900">VELITAS APP</span>
        </div>
      </template>
      <template #item="{item}">
        <a v-if="item.root"
           class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative items-center"
           style="border-radius: 2rem">
          <span :class="[item.icon, item.iconColor ]"/>
          <span class="ml-2 flex-1">{{ item.label }}</span>
          <span class="pi pi-chevron-right text-sm"/>
        </a>
        <router-link v-else v-slot="{ href, navigate }" :to="{name: item.route}" custom>
          <a :href="href" @click="navigate"
             class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative items-center">
            <span :class="[item.icon, item.iconColor ]"/>
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <div class="flex items-end justify-start h-full">
          <div class="w-full mx-2">
            <Avatar shape="circle">
              <template #icon>
                <i :class="isLoggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
                   class="text-slate-950 dark:text-slate-50"></i>
              </template>
            </Avatar>
            <span class="text-slate-950 dark:text-slate-50">{{ isLoggedIn ? 'Salir' : "Iniciar sesión" }}</span>
          </div>
        </div>
      </template>
    </MegaMenu>
  </aside>
</template>
<script setup>

import {computed, ref} from "vue";
import {menuItems} from "@/core/constants.js";

const isLoggedIn = computed(() => {
  // Todo: agregar storage para usuario loguedo
  return true
})


const items = ref(menuItems)

</script>