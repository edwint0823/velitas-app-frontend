<template>
  <Dialog
    v-model:visible="modalEditCustomerVisible"
    modal
    :header="isEdit ? `Editar cliente ${name}` : 'Crear nuevo cliente'"
    :style="{ 'min-width': '30vw' }"
    :auto-z-index="false"
  >
    <div class="mb-4">
      <div class="mx-3 my-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mx-0">
        <div class="flex flex-col gap-2">
          <label for="email">Correo electrónico:</label>
          <InputText id="email" v-model="email" type="email" class="w-full" :disabled="isEdit" />
          <small class="text-red-600" :class="{ hidden: !errors.email }">{{ errors.email }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="name">Nombre:</label>
          <InputText id="name" v-model="name" type="text" class="w-full" />
          <small class="text-red-600" :class="{ hidden: !errors.name }">{{ errors.name }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="price_type">Tipo de precio:</label>
          <Dropdown :options="priceTypeOptions" option-value="name" option-label="name" v-model="price_type"></Dropdown>
          <small class="text-red-600" :class="{ hidden: !errors.price_type }">{{ errors.price_type }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="phone_number">Número telefónico:</label>
          <InputMask
            id="customer_tel"
            v-model="phone_number"
            mask="999 999 9999"
            placeholder="999 999 9999"
            class="w-full"
          />
          <small class="text-red-600" :class="{ hidden: !errors.phone_number }">{{ errors.phone_number }}</small>
        </div>
      </div>
    </div>
    <div class="flex justify-center pt-3 lg:pt-0">
      <Button
        icon="pi pi-save"
        :label="isEdit ? 'Actualizar información' : 'Guardar información'"
        @click="submitFormInfo"
      />
    </div>
  </Dialog>
</template>
<script setup>
import * as yup from "yup";
import { inject, ref } from "vue";
import { createCustomer, getDataClientByEmail, updateCustomer } from "@/services/customers/customer.service.js";
import { createAndUpdateCustomerMessages, priceTypeOptionsList } from "@/core/constants.js";
import { useForm } from "vee-validate";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const emits = defineEmits(["operationFinished"]);
const swal = inject("$swal");

const modalEditCustomerVisible = ref(false);
const priceTypeOptions = ref(priceTypeOptionsList);

const schema = yup.object().shape({
  email: yup
    .string()
    .default("")
    .email(createAndUpdateCustomerMessages.validEmail)
    .required(createAndUpdateCustomerMessages.requiredEmail),
  name: yup.string().default("").required(createAndUpdateCustomerMessages.requiredName),
  phone_number: yup
    .string()
    .default(null)
    .required(createAndUpdateCustomerMessages.requiredPhone)
    .max(12, createAndUpdateCustomerMessages.completePhone)
    .min(12, createAndUpdateCustomerMessages.completePhone),
  price_type: yup.string().default(null).required(createAndUpdateCustomerMessages.priceTypeRequired),
});

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [email] = defineField("email");
const [name] = defineField("name");
const [phone_number] = defineField("phone_number");
const [price_type] = defineField("price_type");

const openModalCustomer = async (customerEmail = "", isEdit = false) => {
  if (isEdit) {
    await getDataClientByEmail(customerEmail).then(({ data }) => {
      email.value = data.email;
      name.value = data.name;
      phone_number.value = data.tel;
      price_type.value = data.priceType;
    });
  }
  modalEditCustomerVisible.value = true;
};

const submitFormInfo = handleSubmit(async (values) => {
  if (props.isEdit) {
    const payload = {
      name: values.name,
      phone_number: values.phone_number,
      price_type: values.price_type,
    };
    await updateCustomer(values.email, payload).then(({ data }) => {
      swal({
        icon: "success",
        title: "Operación realizada con éxito",
        text: data.message,
        allowOutsideClick: false,
      }).then(() => {
        emits("operationFinished");
      });
    });
  } else {
    await createCustomer(values).then(({ data }) => {
      swal({
        icon: "success",
        title: "Operación realizada con éxito",
        text: data.message,
        allowOutsideClick: false,
      }).then(() => {
        emits("operationFinished");
      });
    });
  }
  resetForm();
  modalEditCustomerVisible.value = false;
});

defineExpose({
  openModalCustomer,
});
</script>

<style scoped></style>
