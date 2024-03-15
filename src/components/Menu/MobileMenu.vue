<template>
  <div>
    <MegaMenu :model="isLoggedIn ? items : []" class="w-full">
      <template #start v-if="!isLoggedIn">
        <div class="flex items-center justify-start">
          <img src="/images/logos/logo_app.png" alt="" class="w-1/6" />
          <span class="font-semibold text-surface-900 dark:text-white">VELITAS APP</span>
        </div>
      </template>
      <template #menubuttonicon>
        <img src="/images/logos/logo_app.png" alt="" class="w-full" />
      </template>
      <template #item="{ item }">
        <a
          v-if="item.root"
          class="align-items-center relative flex cursor-pointer items-center overflow-hidden px-3 py-2"
          style="border-radius: 2rem"
        >
          <span :class="[item.icon, item.iconColor]" />
          <span class="ml-2 flex-1">{{ item.label }}</span>
          <span class="pi pi-chevron-down text-sm" />
        </a>
        <router-link v-else v-slot="{ href, navigate }" :to="{ name: item.route }" custom>
          <a
            :href="href"
            @click="navigate"
            class="align-items-center relative flex cursor-pointer items-center overflow-hidden px-3 py-2"
          >
            <span :class="[item.icon, item.iconColor]" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <Avatar shape="circle">
          <template #icon>
            <i
              :class="isLoggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
              class="text-slate-950 dark:text-slate-50"
              @click="loginOrLogout"
            ></i>
          </template>
        </Avatar>
      </template>
    </MegaMenu>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { menuItems } from "@/core/constants.js";
import { useAuthStore } from "@/store/auth/auth.store.js";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => {
  return authStore.isLoggedIn;
});

const items = ref(menuItems);

const loginOrLogout = () => {
  if (isLoggedIn.value) {
    authStore.logout();
  }
  router.push({ name: "login" });
};
</script>

<style scoped></style>
