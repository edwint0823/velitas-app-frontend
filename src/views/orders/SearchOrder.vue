<template>
  <div v-show="showSearch">
    <div class="flex justify-center">
      <span class="text-3xl font-extrabold">Buscar pedido</span>
    </div>
    <div class="flex flex-col gap-2 pb-6 pt-8">
      <label class="text-lg font-semibold">Nro de orden: </label>
      <div class="flex flex-wrap gap-2">
        <InputText type="text" placeholder="Código de la orden" class="w-1/3 max-[430px]:w-full" v-model="code" />
        <Button icon="pi pi-search" raised label="Buscar pedido" @click="searchOrder" />
      </div>
    </div>
  </div>
  <div v-show="!showSearch">
    <div class="flex justify-end">
      <Button
        severity="help"
        icon="pi pi-refresh"
        raised
        label="Buscar otro pedido"
        @click="clearSearch"
        class="max-[430px]:mr-3 max-[430px]:mt-3 sm:mr-5 sm:mt-5 lg:mr-0 lg:mt-0"
      />
    </div>
    <ViewOrderByCode ref="viewOrderByCodeRef" />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { baseStructureOrderDetailByCode, breadCrumbsLabels } from "@/core/constants.js";
import { useMainStore } from "@/store/main.store.js";
import { useRoute, useRouter } from "vue-router";
import { getOrderByCode } from "@/services/orders/order.service.js";
import ViewOrderByCode from "@/components/orders/ViewOrderByCode.vue";

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();

const viewOrderByCodeRef = ref();

const code = ref("");
const showSearch = ref(true);

const searchOrder = async () => {
  await getOrderByCode(code.value).then(({ data }) => {
    viewOrderByCodeRef.value.loadOrder(data, code.value);
    showSearch.value = false;
  });
};

const clearSearch = () => {
  if (route.params.code !== "") {
    router.push({ name: "search_order", params: { code: "" } });
  }
  code.value = "";
  showSearch.value = true;
  viewOrderByCodeRef.value.loadOrder(baseStructureOrderDetailByCode, "0");
};
onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.order.main },
    { label: breadCrumbsLabels.order.searchOrderByCode, route: "search_order" },
  ]);
  if (route.params.code !== "") {
    code.value = route.params.code;
    await searchOrder();
  }
});
</script>
