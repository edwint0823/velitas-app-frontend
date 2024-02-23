<template>
  <div class="min-w-screen flex min-h-screen items-center justify-center">
    <div class="min-w-screen grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div class="flex justify-center bg-sky-400 p-16" v-if="!isMobile">
        <img src="../../assets/login-panel.svg" alt="" class="w-full" />
      </div>
      <div class="justify-top flex flex-col items-center min-[280px]:mx-2 sm:mx-16">
        <img src="/images/logos/logo_app.png" alt="" class="w-1/3 pb-3 pt-7" />
        <span class="pb-6 text-2xl font-extrabold text-surface-900"> VELITAS APP </span>
        <div class="relative mx-auto w-full p-3">
          <div
            class="absolute inset-0 -skew-y-6 transform rounded-3xl bg-gradient-to-r from-green-400 to-sky-500 shadow-lg sm:-rotate-6 sm:skew-y-0"
          ></div>
          <div class="relative rounded-3xl bg-surface-900 p-7 text-white shadow-lg dark:bg-sky-300 dark:text-black">
            <div class="mb-5 flex justify-center">
              <span class="text-3xl font-bold">Iniciar Sesión</span>
            </div>
            <div class="my-7 flex flex-col gap-2">
              <label class="text-lg font-semibold">Correo electrónico</label>
              <InputText type="email" placeholder="ejemplo@ejemplo.com" size="large" v-model="email" />
              <small class="font-bold text-red-600" :class="{ hidden: !errors.email }">
                {{ errors.email }}
              </small>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-lg font-semibold">Contraseña</label>
              <InputText type="password" placeholder="Contraseña" size="large" v-model="password" />
              <small class="font-bold text-red-600" :class="{ hidden: !errors.password }">
                {{ errors.password }}
              </small>
            </div>
            <button class="mt-7 w-full rounded-lg bg-surface-200 py-3 dark:bg-surface-900" @click="logIn">
              <span class="text-lg font-bold text-black dark:text-white"> Iniciar sesión </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as yup from "yup";
import { computed } from "vue";
import { helper } from "@/utils/helper.js";
import { useForm } from "vee-validate";
import { loginMessages } from "@/core/constants.js";

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const schema = yup.object({
  email: yup.string().default("").email(loginMessages.validEmail).required(loginMessages.requiredEmail),
  password: yup.string().default("").min(6, loginMessages.minLengthPassword).required(loginMessages.requiredPassword),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [email] = defineField("email");
const [password] = defineField("password");

const logIn = handleSubmit((values) => {
  console.log(values);
});
</script>
