<template>
  <h1>List of orders</h1>
  <div v-for="(field, idx) in fields" :key="field.key">
    <input type="text" v-model="field.value.url" class="mr-2" />
    <span v-if="errors[`links[${idx}].url`]">{{ errors[`links[${idx}].url`] }}</span>
    <input type="text" v-model="field.value.name" />
    <span v-if="errors[`links[${idx}].name`]">{{ errors[`links[${idx}].name`] }}</span>
    <button type="button" @click="remove(idx)" class="ml-2 bg-red-500">Remove</button>
  </div>
  <button type="button" @click="push({ id: fields.length, url: '', name: '' })" class="mr-2 bg-green-400 p-2">
    Add
  </button>
  <button @click="save" class="mr-2 bg-green-400 p-2">Submit</button>
  <!--    <button @click="onSubmit" class="bg-green-400 p-2 mr-2">Submit</button>-->
</template>
<script setup>
import { onMounted } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { useFieldArray, useForm } from "vee-validate";
import * as yup from "yup";

const mainStore = useMainStore();
onMounted(() => {
  mainStore.setBreadcrumbs([{ label: "Pedidos" }, { label: "Lista de pedidos", route: "list_orders" }]);
});

const { handleSubmit, errors } = useForm({
  initialValues: {
    links: [{ id: 0, url: "", name: "" }],
  },
  validationSchema: yup.object({
    links: yup.array().of(
      yup.object({
        id: yup.number().required(),
        url: yup.string().required(),
        name: yup.string().required("el nombre es requerido"),
      }),
    ),
  }),
});

const { remove, push, fields } = useFieldArray("links");

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values, null, 2));
  console.log(errors);
});
const save = () => {
  console.log("submit", fields.value);
};
</script>
