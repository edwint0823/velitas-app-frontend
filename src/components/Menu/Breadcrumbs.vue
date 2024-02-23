<template>
  <header class="mb-4 flex">
    <Breadcrumb
      :home="home"
      :model="breadcrumb_items"
      class="text-dark w-full rounded-lg bg-surface-200 p-5 dark:bg-surface-900 dark:text-white"
    >
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{ name: item.route }" custom>
          <a :href="href" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary text-sm font-semibold lg:text-base xl:text-base 2xl:text-base">
              {{ item.label }}
            </span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-color text-sm lg:text-base xl:text-base 2xl:text-base">
            {{ item.label }}
          </span>
        </a>
      </template>
    </Breadcrumb>
    <div class="ml-2 w-[9rem]" v-if="!isLoggedIn && !isMobile">
      <div
        class="my-auto cursor-pointer rounded-lg bg-surface-200 p-4 dark:bg-surface-900"
        @click="$router.push({ name: 'login' })"
      >
        <Avatar shape="circle">
          <template #icon>
            <i class="pi pi-sign-in text-slate-950 dark:text-slate-50"></i>
          </template>
        </Avatar>
        <span class="text-slate-950 dark:text-slate-50"> Ingresar </span>
      </div>
    </div>
  </header>
</template>
<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { helper } from "@/utils/helper.js";

const home = ref({
  icon: "pi pi-home",
  route: "dashboard",
});
const mainStore = useMainStore();

const isLoggedIn = computed(() => {
  // Todo: agregar storage para usuario loguedo
  return false;
});
const isMobile = computed(() => {
  return helper.isMobileDevice();
});
const breadcrumb_items = computed(() => {
  return mainStore.getBreadcrumbs;
});
</script>
