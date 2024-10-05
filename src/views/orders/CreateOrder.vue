<template>
  <div style="min-height: 84vh">
    <div class="grid grid-cols-2 px-2 pb-4 pt-2 md:grid-cols-5 lg:px-0">
      <div class="col-span-0 flex justify-center md:col-span-4">
        <span class="text-xl font-bold md:text-2xl">Crear pedido</span>
      </div>
      <div class="flex justify-end">
        <Button
          severity="help"
          icon="pi pi-search"
          raised
          v-tooltip="'Buscar un pedido'"
          :label="isMobile ? null : 'Buscar un pedido'"
          @click="$router.push({ name: 'search_order' })"
        />
      </div>
    </div>
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
        <div v-show="showClientExtraInfo && customerOrders.length" class="mt-4">
          <Accordion :activeIndex="1">
            <AccordionTab header="Pedidos anteriores">
              <div class="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-12">
                <Chip
                  v-for="order in customerOrders"
                  :key="order.code"
                  class="cursor-pointer rounded-lg"
                  @click="openNewTapOrder(order.code)"
                >
                  <template #default>
                    <div class="flex flex-col gap-1 p-2">
                      <span class="text-sm font-bold">{{ order.code }}</span>
                      <span class="text-xs font-light">{{ order.created_at }}</span>
                    </div>
                  </template>
                </Chip>
              </div>
            </AccordionTab>
          </Accordion>
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
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useMainStore } from "@/store/main.store.js";
import { useOrdersCreateStore } from "@/store/order/orders_create.store.js";
import { getDataClientByEmail } from "@/services/customers/customer.service.js";
import CreateDetailsOrder from "@/components/orders/CreateDetailsOrder.vue";
import { breadCrumbsLabels, createOrderValidation } from "@/core/constants.js";
import { helper } from "@/utils/helper.js";
import router from "@/router/index.js";

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const mainStore = useMainStore();
const ordersCreateStore = useOrdersCreateStore();

const createDetailsOrderRef = ref();
const customerOrders = ref([]);

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
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [customer_email] = defineField("customer_email");
const [customer_name] = defineField("customer_name");
const [customer_tel] = defineField("customer_tel");

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
          customerOrders.value = data.orders;
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
    customerOrders.value = [];
    resetForm();
    createDetailsOrderRef.value.clearList();
  }
};

const openNewTapOrder = (code) => {
  const url = router.resolve({ name: "search_order", params: { code } }).href;
  window.open(url, "_blank");
};

onMounted(() => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.order.main },
    { label: breadCrumbsLabels.order.createOrder, route: "create_order" },
  ]);
});
</script>
