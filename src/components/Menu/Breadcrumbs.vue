<template>
  <header class="mb-4 ">
    <Breadcrumb :home="home" :model="breadcrumb_items"
                class="w-full p-5 text-dark bg-surface-200 dark:text-white dark:bg-surface-900 rounded-lg">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{name: item.route}" custom>
          <a :href="href" @click="navigate">
            <span :class="[item.icon, 'text-color']"/>
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-color">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </header>
</template>
<script setup>

import {computed, ref} from "vue";
import {useMainStore} from '@/store/main.store.js'

const home = ref({
  icon: 'pi pi-home',
  route: 'dashboard'
});
const mainStore = useMainStore()
const breadcrumb_items = computed(() => {
  return mainStore.getBreadcrumbs
})
</script>