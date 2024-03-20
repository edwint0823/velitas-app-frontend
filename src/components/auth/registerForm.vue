<template>
  <div
    class="absolute inset-0 -skew-y-6 transform rounded-3xl bg-gradient-to-r from-green-400 to-sky-500 shadow-lg sm:-rotate-6 sm:skew-y-0"
  ></div>
  <div class="relative rounded-3xl bg-surface-900 p-7 text-white shadow-lg dark:bg-sky-300 dark:text-black">
    <div class="mb-5 flex justify-center">
      <span class="text-3xl font-bold">Registrarse</span>
    </div>
    <div class="my-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold">Nombres</label>
        <InputText type="text" placeholder="Nombres" size="large" v-model="first_name" />
        <small class="font-bold text-red-600" :class="{ hidden: !errors.first_name }">
          {{ errors.first_name }}
        </small>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold">Apellidos</label>
        <InputText type="text" placeholder="Apellidos" size="large" v-model="last_name" />
        <small class="font-bold text-red-600" :class="{ hidden: !errors.last_name }">
          {{ errors.last_name }}
        </small>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold">Usuario</label>
        <InputText type="text" placeholder="Ejemplo" size="large" v-model="username" />
        <small class="font-bold text-red-600" :class="{ hidden: !errors.username }">
          {{ errors.username }}
        </small>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold">Correo electrónico</label>
        <InputText type="email" placeholder="ejemplo@ejemplo.com" size="large" v-model="email" />
        <small class="font-bold text-red-600" :class="{ hidden: !errors.email }">
          {{ errors.email }}
        </small>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-lg font-semibold">Contraseña</label>
        <InputText type="password" placeholder="Contraseña" size="large" v-model="password" @keyup.enter="register" />
        <small class="font-bold text-red-600" :class="{ hidden: !errors.password }">
          {{ errors.password }}
        </small>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2">
      <button class="mt-7 w-full rounded-lg bg-surface-200 py-3 dark:bg-surface-900" @click="registerUser">
        <span class="text-lg font-bold text-black dark:text-white"> Crear cuenta </span>
      </button>
      <button
        class="mt-7 w-full rounded-lg border-2 border-surface-200 bg-transparent py-3 dark:border-surface-900"
        @click="$emit('showLoginForm')"
      >
        <span class="text-lg font-bold text-white dark:text-black"> Iniciar Sesión </span>
      </button>
    </div>
  </div>
</template>
<script setup>
import * as yup from "yup";
import { registerMessages, successMessages } from "@/core/constants.js";
import { useForm } from "vee-validate";
import { register } from "@/services/auth/auth.service.js";
import { inject } from "vue";

const emit = defineEmits(["showLoginForm"]);
const swal = inject("$swal");

const schema = yup.object({
  first_name: yup.string().default("").required(registerMessages.requiredFirstName),
  last_name: yup.string().default("").required(registerMessages.requiredLastName),
  username: yup.string().default("").required(registerMessages.userNameRequired),
  email: yup.string().default("").email(registerMessages.validEmail).required(registerMessages.requiredEmail),
  password: yup
    .string()
    .default("")
    .min(6, registerMessages.minLengthPassword)
    .required(registerMessages.requiredPassword),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [first_name] = defineField("first_name");
const [last_name] = defineField("last_name");
const [username] = defineField("username");
const [email] = defineField("email");
const [password] = defineField("password");

const registerUser = handleSubmit(async (values) => {
  await register(values).then(({ data }) => {
    swal({
      icon: "success",
      title: successMessages.userRegistered,
    });
    resetForm();
    emit("showLoginForm");
  });
});
</script>

<style scoped></style>
