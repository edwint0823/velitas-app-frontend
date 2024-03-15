<template>
  <div
    class="absolute inset-0 -skew-y-6 transform rounded-3xl bg-gradient-to-r from-green-400 to-sky-500 shadow-lg sm:-rotate-6 sm:skew-y-0"
  ></div>
  <div class="relative rounded-3xl bg-surface-900 p-7 text-white shadow-lg dark:bg-sky-300 dark:text-black">
    <div class="mb-5 flex justify-center">
      <span class="text-3xl font-bold">Iniciar Sesión</span>
    </div>
    <div class="my-7 flex flex-col gap-2">
      <label class="text-lg font-semibold">Usuario</label>
      <InputText type="text" placeholder="usuario" size="large" v-model="user_name" @keyup.enter="logIn" />
      <small class="font-bold text-red-600" :class="{ hidden: !errors.user_name }">
        {{ errors.user_name }}
      </small>
    </div>
    <div class="flex flex-col gap-2">
      <label class="text-lg font-semibold">Contraseña</label>
      <InputText type="password" placeholder="Contraseña" size="large" v-model="password" @keyup.enter="logIn" />
      <small class="font-bold text-red-600" :class="{ hidden: !errors.password }">
        {{ errors.password }}
      </small>
    </div>
    <div class="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2">
      <button class="mt-7 w-full rounded-lg bg-surface-200 py-3 dark:bg-surface-900" @click="logIn">
        <span class="text-lg font-bold text-black dark:text-white"> Iniciar sesión </span>
      </button>
      <button
        class="mt-7 w-full rounded-lg border-2 border-surface-200 bg-transparent py-3 dark:border-surface-900"
        @click="$emit('showRegisterForm')"
      >
        <span class="text-lg font-bold text-white dark:text-black"> Crear cuenta </span>
      </button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth/auth.store.js";
import * as yup from "yup";
import { loginMessages } from "@/core/constants.js";
import { useForm } from "vee-validate";
import { Login } from "@/services/auth/auth.service.js";

defineEmits(["showRegisterForm"]);
const router = useRouter();
const authStore = useAuthStore();

const schema = yup.object({
  user_name: yup.string().default("").required(loginMessages.requiredUserName),
  password: yup.string().default("").min(4, loginMessages.minLengthPassword).required(loginMessages.requiredPassword),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [user_name] = defineField("user_name");
const [password] = defineField("password");

const logIn = handleSubmit(async (values) => {
  await Login(values).then(({ data }) => {
    authStore.setToken(data.token);
    authStore.setUserInfo(data.user);
    router.push({ name: "dashboard" });
  });
});
</script>
<style scoped></style>
