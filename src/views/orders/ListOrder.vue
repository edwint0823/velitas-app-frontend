<template>
  <div class="p-3 sm:p-0">
    <h2 class="mb-3 text-xl font-bold">Filtros</h2>
    <div class="grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      <div class="md:col-span-0 col-span-1 flex flex-col lg:col-span-2">
        <label class="mb-2 font-semibold">Nro Pedido(s)</label>
        <Chips v-model="filters.orders_code" separator="," placeholder="Nro pedido(s) separado por coma (,)" />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 font-semibold">Nombre del cliente</label>
        <InputText v-model="filters.customer_name" type="text" placeholder="Nombre del cliente" />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 font-semibold">Fecha de entrega inicial</label>
        <Calendar
          v-model="filters.delivery_date_begin"
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          :showOnFocus="false"
          :manualInput="false"
          :touchUI="isMobile"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 font-semibold">Fecha de entrega final</label>
        <Calendar
          v-model="filters.delivery_date_end"
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          :showOnFocus="false"
          :manualInput="false"
          :touchUI="isMobile"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 font-semibold">Fecha de creación inicial</label>
        <Calendar
          v-model="filters.created_at_begin"
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          :showOnFocus="false"
          :manualInput="false"
          :touchUI="isMobile"
        />
      </div>
      <div class="flex flex-col">
        <label class="mb-2 font-semibold">Fecha de creación final</label>
        <Calendar
          v-model="filters.created_at_end"
          dateFormat="yy-mm-dd"
          showIcon
          showButtonBar
          :showOnFocus="false"
          :manualInput="false"
          :touchUI="isMobile"
        />
      </div>
      <div class="col-span-1 flex items-end justify-center gap-4 sm:col-span-2 md:justify-end lg:col-span-1">
        <Button label="Buscar" icon="pi pi-search" @click="searchOrder" severity="info" />
        <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
      </div>
    </div>
    <h2 class="mb-3 mt-5 text-xl font-bold">Listado de pedidos</h2>
    <div>
      <div v-if="!orders.length">
        <EmptyView message="No se encontraron pedidos con los filtros aplicados" />
      </div>
      <div v-else>
        <DataView :value="orders" layout="grid">
          <template #grid>
            <div class="grid grid-cols-1 gap-5 p-3 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="order in orders" class="rounded-xl border border-surface-500 p-4 dark:border-surface-200">
                <div class="flex justify-between">
                  <h5 class="text-lg font-semibold">Nro. {{ order.code }}</h5>
                  <h4 class="font-bold" :class="statusColor(order.status_name)">{{ order.status_name }}</h4>
                </div>
                <h5 class="mb-5 font-light">{{ order.customer_name }}</h5>
                <h6 class="font-light">Entrega: {{ order.delivery_date }}</h6>
                <h6 class="font-light">Creado: {{ order.created_at }}</h6>
                <h6 class="font-light">Cantidad: {{ order.total_quantity }}</h6>
                <h6 class="font-light">Total: {{ $h.formatCurrency(order.total_price, 2) }}</h6>
              </div>
            </div>
          </template>
          <template #footer>
            <Paginator
              v-model="paginator.page_number"
              :rows="paginator.page_size"
              :totalRecords="paginator.total"
              :rowsPerPageOptions="[10, 20, 30]"
              @page="onPageChange"
              class="rounded-lg"
            />
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, onMounted, ref } from "vue";
import EmptyView from "@/components/general/EmptyView.vue";
import { useMainStore } from "@/store/main.store.js";
import { helper } from "@/utils/helper.js";
import { paginateOrderList } from "@/services/orders/order.service.js";
import { paginatedListOrders, statusColorPalette } from "@/core/constants.js";
import { useDayJs } from "@/utils/useDayJs.js";

const dayjs = useDayJs();
const swal = inject("$swal");
const mainStore = useMainStore();

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const filters = ref({
  orders_code: [],
  customer_name: "",
  delivery_date_begin: null,
  delivery_date_end: null,
  created_at_begin: null,
  created_at_end: null,
});
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});
const orders = ref([]);

const clearFilters = () => {
  filters.value.orders_code = [];
  filters.value.customer_name = "";
  filters.value.delivery_date_begin = null;
  filters.value.delivery_date_end = null;
  filters.value.created_at_begin = null;
  filters.value.created_at_end = null;
  searchOrder();
};
const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = event.first + 1;
  searchOrder();
};

const searchOrder = async () => {
  const payload = {
    filters: {},
  };
  if (
    filters.value.delivery_date_begin !== null &&
    filters.value.delivery_date_end !== null &&
    dayjs(filters.value.delivery_date_end).isBefore(filters.value.delivery_date_begin)
  ) {
    swal({
      icon: "warning",
      title: paginatedListOrders.validateFiltersTittle,
      text: paginatedListOrders.deliveryDateFilterError,
    });
    return;
  }
  if (
    filters.value.created_at_begin !== null &&
    filters.value.created_at_end !== null &&
    dayjs(filters.value.created_at_end).isBefore(filters.value.created_at_begin)
  ) {
    swal({
      icon: "warning",
      title: paginatedListOrders.validateFiltersTittle,
      text: paginatedListOrders.createdAtFilterError,
    });
    return;
  }

  if (filters.value.orders_code.length) {
    payload["filters"]["orders_code"] = filters.value.orders_code.join(",");
  }
  if (filters.value.customer_name !== "") {
    payload["filters"]["customer_name"] = filters.value.customer_name.toUpperCase();
  }
  if (filters.value.delivery_date_begin !== null) {
    payload["filters"]["delivery_date_begin"] = dayjs(filters.value.delivery_date_begin).format("YYYY-MM-DD");
  }
  if (filters.value.delivery_date_end !== null) {
    payload["filters"]["delivery_date_end"] = dayjs(filters.value.delivery_date_end).format("YYYY-MM-DD");
  }
  if (filters.value.created_at_begin !== null) {
    payload["filters"]["created_at_begin"] = dayjs(filters.value.created_at_begin).format("YYYY-MM-DD");
  }
  if (filters.value.created_at_end !== null) {
    payload["filters"]["created_at_end"] = dayjs(filters.value.created_at_end).format("YYYY-MM-DD");
  }
  await paginateOrderList(paginator.value.page_number, paginator.value.page_size, payload).then(({ data }) => {
    orders.value = data.orders;
    paginator.value.total = data.total;
  });
};
const statusColor = (statusName) => {
  return statusColorPalette[statusName];
};
onMounted(() => {
  mainStore.setBreadcrumbs([{ label: "Pedidos" }, { label: "Lista de pedidos", route: "list_orders" }]);
  searchOrder();
});
</script>
