<template>
  <Loading />
  <div class="max-w-screen max-h-screen">
    <div class="min-w-screen grid-cols-1n grid min-h-screen lg:grid-cols-2">
      <div class="flex justify-center bg-sky-400 p-16" v-if="!isMobile">
        <img src="../../assets/login-panel.svg" alt="" class="w-full" />
      </div>
      <div class="justify-top flex flex-col items-center min-[280px]:mx-2 sm:mx-16">
        <img src="/images/logos/logo_app.png" alt="" class="pt-5" />
        <span class="pb-6 text-2xl font-extrabold text-surface-900"> CERA AMIGOS </span>
        <div class="relative mx-auto w-full p-3">
          <LoginForm v-if="showLoginForm" @show-register-form="showLoginForm = !showLoginForm" />
          <RegisterForm v-else @show-login-form="showLoginForm = !showLoginForm" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loading from "@/components/general/Loading.vue";
import LoginForm from "@/components/auth/loginForm.vue";
import RegisterForm from "@/components/auth/registerForm.vue";
import { computed, ref } from "vue";
import { helper } from "@/utils/helper.js";

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const showLoginForm = ref(true);
</script>
