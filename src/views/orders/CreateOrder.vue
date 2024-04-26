<template>
  <div style="min-height: 84vh">
    <Card class="mb-5">
      <template #title>Información del cliente</template>
      <template #content>
        <div class="grid grid-cols-1 gap-x-16 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          <div class="flex flex-col gap-2">
            <label for="customer_email">Correo electrónico: </label>
            <div class="flex w-full items-center gap-2">
              <InputText
                id="customer_email"
                v-model="customer_email"
                type="text"
                class="w-full"
                :disabled="disableFields"
              />
              <Button :icon="`pi pi-${!disableFields ? 'search' : 'pencil'}`" raised @click="searchClient" />
            </div>
            <small class="text-red-600" :class="{ hidden: !errors.customer_email }">{{ errors.customer_email }}</small>
          </div>
          <div class="flex flex-col gap-2" v-if="showClientExtraInfo">
            <label for="customer_name">Nombre:</label>
            <InputText
              id="customer_name"
              v-model="customer_name"
              type="text"
              class="w-full"
              :disabled="disableFields"
            />
            <small class="text-red-600" :class="{ hidden: !errors.customer_name }">{{ errors.customer_name }}</small>
          </div>
          <div class="flex flex-col gap-2" v-if="showClientExtraInfo">
            <label for="customer_tel">Num. telefónico:</label>
            <InputMask
              id="customer_tel"
              v-model="customer_tel"
              mask="999 999 9999"
              placeholder="999 999 9999"
              class="w-full"
              :disabled="disableFields"
            />
            <small class="text-red-600" :class="{ hidden: !errors.customer_tel }">{{ errors.customer_tel }}</small>
          </div>
        </div>
        <div class="mt-3 flex justify-end">
          <Button type="button" label="Guardar" @click="saveClientData" v-show="showSubmitButton" />
        </div>
      </template>
    </Card>
    <div v-show="showTableProducts">
      <CreateDetailsOrder ref="createDetailsOrderRef" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useMainStore } from "@/store/main.store.js";
import { useOrdersCreateStore } from "@/store/order/orders_create.store.js";
import { getDataClientByEmail } from "@/services/customers/customer.service.js";
import CreateDetailsOrder from "@/components/orders/CreateDetailsOrder.vue";
import { breadCrumbsLabels, createOrderValidation } from "@/core/constants.js";

const mainStore = useMainStore();
const ordersCreateStore = useOrdersCreateStore();

const createDetailsOrderRef = ref();

const schema = yup.object({
  customer_email: yup
    .string()
    .default("")
    .email(createOrderValidation.validEmail)
    .required(createOrderValidation.requiredEmail),
  customer_name: yup.string().default("").required(createOrderValidation.requiredName).max(50),
  customer_tel: yup
    .string()
    .required(createOrderValidation.requiredPhone)
    .max(12, createOrderValidation.completePhone)
    .min(12, createOrderValidation.completePhone),
  // delivery_address: yup.string().default("").required(createOrderValidation.requiredDeliveryAddress),
  // additional_info: yup.string().default(""),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [customer_email] = defineField("customer_email");
const [customer_name] = defineField("customer_name");
const [customer_tel] = defineField("customer_tel");
// const [delivery_address] = defineField("delivery_address");
// const [additional_info] = defineField("additional_info");
const priceType = ref("detal");

const showClientExtraInfo = ref(false);
const disableFields = ref(false);
const showSubmitButton = ref(false);
const showTableProducts = ref(false);

const saveClientData = handleSubmit((values) => {
  ordersCreateStore.setCustomerInfo({
    email: values.customer_email,
    name: values.customer_name,
    tel: values.customer_tel,
    priceType: priceType.value,
  });
  disableFields.value = true;
  showTableProducts.value = true;
  console.log(disableFields.value, showTableProducts.value);
});

const searchClient = async () => {
  if (!disableFields.value) {
    if (!errors.value.hasOwnProperty("customer_email") && ![undefined, "", null].includes(customer_email.value)) {
      await getDataClientByEmail(customer_email.value).then(({ data }) => {
        const { found, ...clientData } = data;
        if (found) {
          customer_name.value = clientData.name;
          customer_tel.value = clientData.tel;
          priceType.value = clientData.priceType;
          showSubmitButton.value = false;
          saveClientData();
        } else {
          priceType.value = "detal";
          showSubmitButton.value = true;
        }
        showClientExtraInfo.value = true;
      });
    }
  } else {
    //
    disableFields.value = false;
    showClientExtraInfo.value = false;
    showSubmitButton.value = false;
    showTableProducts.value = false;
    ordersCreateStore.setCustomerInfo({
      email: "",
      name: "",
      tel: "",
      priceType: "",
    });
    resetForm();
    createDetailsOrderRef.value.clearList();
  }
};

onMounted(() => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.order.main },
    { label: breadCrumbsLabels.order.createOrder, route: "create_order" },
  ]);
});
</script>
