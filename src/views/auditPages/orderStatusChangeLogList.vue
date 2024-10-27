<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Cambios de estado realizados a pedidos</span>
  </div>
  <Card class="mb-5 mt-4">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Código de pedido</label>
          <InputText v-model="filters.order_code" placeholder="Código de pedido" />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Usuario</label>
          <InputText v-model="filters.created_by_name" placeholder="Nombre de usuario" />
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
        <div class="col-span-1 flex items-end justify-center gap-4 sm:justify-end lg:col-span-4">
          <Button label="Buscar" icon="pi pi-search" @click="searchChangeLogs" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <DataTable :value="changeLogsList">
    <template #empty>
      <EmptyView message="No hay cambios de estado de pedido por mostrar con los filtros aplicados" class="p-2" />
    </template>
    <Column field="orderCode" header="Nro de pedido"></Column>
    <Column field="oldStatusName" header="Estado antiguo"></Column>
    <Column field="newStatusName" header="Estado nuevo"></Column>
    <Column field="createdAt" header="Fecha de cambio"></Column>
    <Column field="createdByName" header="Usuario"></Column>
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
  </DataTable>
</template>
<script setup>
import { useMainStore } from "@/store/main.store.js";
import { useDayJs } from "@/utils/useDayJs.js";
import { computed, inject, onMounted, ref } from "vue";
import { helper } from "@/utils/helper.js";
import { orderChangeStatusLogsList } from "@/services/auditory/auditory.service.js";
import { breadCrumbsLabels, paginateListOrderStatusChangeLogs } from "@/core/constants.js";
import EmptyView from "@/components/general/EmptyView.vue";

const mainStore = useMainStore();
const dayjs = useDayJs();
const swal = inject("$swal");

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const changeLogsList = ref([]);
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});
const filters = ref({
  order_code: null,
  created_at_begin: null,
  created_at_end: null,
  created_by_name: null,
});

const searchChangeLogs = async () => {
  if (
    filters.value.created_at_begin !== null &&
    filters.value.created_at_end !== null &&
    dayjs(filters.value.created_at_end).isBefore(filters.value.created_at_begin)
  ) {
    swal({
      icon: "warning",
      title: paginateListOrderStatusChangeLogs.validateFiltersTittle,
      text: paginateListOrderStatusChangeLogs.createdAtFilterError,
    });
    return;
  }
  const payload = {};
  if (filters.value.order_code) {
    payload["order_code"] = filters.value.order_code;
  }
  if (filters.value.created_by_name) {
    payload["created_by_name"] = filters.value.created_by_name;
  }
  if (filters.value.created_at_begin !== null) {
    payload["created_at_begin"] = dayjs(filters.value.created_at_begin).format("YYYY-MM-DD");
  }
  if (filters.value.created_at_end !== null) {
    payload["created_at_end"] = dayjs(filters.value.created_at_end).format("YYYY-MM-DD");
  }
  await orderChangeStatusLogsList(paginator.value.page_size, paginator.value.page_number, payload).then(({ data }) => {
    changeLogsList.value = data.items;
    paginator.value.total = data.total;
  });
};

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = parseInt(event.page) + 1;
  searchChangeLogs();
};

const clearFilters = () => {
  filters.value.order_code = null;
  filters.value.created_at_begin = null;
  filters.value.created_at_end = null;
  filters.value.created_by_name = null;
  searchChangeLogs();
};
onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.auditory.main },
    {
      label: breadCrumbsLabels.auditory.orderStatusChangeLog,
      route: "list_order_change_status_logs",
    },
  ]);
  await searchChangeLogs();
});
</script>
<style scoped></style>
