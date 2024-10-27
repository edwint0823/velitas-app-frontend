<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Movimientos de inventario de velas </span>
  </div>
  <Card class="mb-5 mt-4">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Tipo de vela</label>
          <Dropdown
            v-model="filters.candle_type_id"
            :options="candleTypeOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un tipo de vela"
          />
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
        <div class="flex flex-col items-center">
          <label class="mb-2 font-semibold">Tipo de movimiento</label>
          <div class="flex items-center gap-2">
            <Checkbox v-model="filters.entry_movement" :binary="true" inputId="entry_movement" />
            <label for="entry_movement">Ingreso</label>
            <Checkbox v-model="filters.out_movement" :binary="true" inputId="out_movement" />
            <label for="out_movement">Salida</label>
          </div>
        </div>
        <div class="col-span-1 flex items-end justify-center gap-4 sm:justify-end lg:col-span-4">
          <Button label="Buscar" icon="pi pi-search" @click="searchMovements" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <DataView :value="candleMovementList" layout="list">
    <template #empty>
      <EmptyView message="No hay movimientos por mostrar con los filtros aplicados" class="p-2" />
    </template>
    <template #list>
      <div class="p-1">
        <div
          v-for="movement in candleMovementList"
          class="m-2 rounded-xl border border-surface-400/80 p-3 dark:border-surface-500/80"
        >
          <div class="grid grid-cols-1 lg:grid-cols-10">
            <div class="col-span-1 flex items-center justify-center">
              <i
                :class="`pi pi-arrow-${movement.is_entry ? 'up' : 'down'} text-${movement.is_entry ? 'green' : 'red'}-500 `"
                class="m-4 text-3xl"
              ></i>
            </div>
            <div class="col-span-1 flex flex-col lg:col-span-8">
              <span class="text-xl font-bold">
                {{ movement.observation }}
              </span>
              <span class="font-semibold"> {{ movement.candleName }} </span>
              <span class="font-semibold"> Registrado por: {{ movement.createdByName }} </span>
              <span class="font-semibold"> {{ movement.createdAt }} </span>
            </div>
            <div class="col-span-1 flex items-start justify-center">
              <span class="text-xl font-bold" :class="`text-${movement.is_entry ? 'green' : 'red'}-500 `">
                {{ movement.quantity }}
              </span>
            </div>
          </div>
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
</template>
<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { helper } from "@/utils/helper.js";
import { listCandleTypes } from "@/services/candleType/candleType.service.js";
import { useDayJs } from "@/utils/useDayJs.js";
import { getCandleInventoryMovements } from "@/services/auditory/auditory.service.js";
import EmptyView from "@/components/general/EmptyView.vue";
import { breadCrumbsLabels, paginateListCandleInventoryMovements } from "@/core/constants.js";

const mainStore = useMainStore();
const dayjs = useDayJs();
const swal = inject("$swal");

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const candleTypeOptions = ref([]);
const filters = ref({
  candle_type_id: null,
  created_by_name: null,
  created_at_begin: null,
  created_at_end: null,
  out_movement: false,
  entry_movement: false,
});

const candleMovementList = ref([]);
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = parseInt(event.page) + 1;
  searchMovements();
};

const clearFilters = () => {
  filters.value.candle_type_id = null;
  filters.value.created_by_name = null;
  filters.value.out_movement = false;
  filters.value.entry_movement = false;
  filters.value.created_at_begin = null;
  filters.value.created_at_end = null;
  searchMovements();
};

const searchMovements = async () => {
  if (
    filters.value.created_at_begin !== null &&
    filters.value.created_at_end !== null &&
    dayjs(filters.value.created_at_end).isBefore(filters.value.created_at_begin)
  ) {
    swal({
      icon: "warning",
      title: paginateListCandleInventoryMovements.validateFiltersTittle,
      text: paginateListCandleInventoryMovements.createdAtFilterError,
    });
    return;
  }
  const payload = {};
  if (filters.value.candle_type_id) {
    payload["candle_type_id"] = filters.value.candle_type_id;
  }
  if (filters.value.created_by_name) {
    payload["created_by_name"] = filters.value.created_by_name;
  }
  if (filters.value.entry_movement) {
    payload["entry_movement"] = filters.value.entry_movement;
  }
  if (filters.value.out_movement) {
    payload["out_movement"] = filters.value.out_movement;
  }
  if (filters.value.created_at_begin !== null) {
    payload["created_at_begin"] = dayjs(filters.value.created_at_begin).format("YYYY-MM-DD");
  }
  if (filters.value.created_at_end !== null) {
    payload["created_at_end"] = dayjs(filters.value.created_at_end).format("YYYY-MM-DD");
  }

  await getCandleInventoryMovements(paginator.value.page_size, paginator.value.page_number, payload).then(
    ({ data }) => {
      candleMovementList.value = data.movements;
      paginator.value.total = data.total;
    },
  );
};

onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.auditory.main },
    {
      label: breadCrumbsLabels.auditory.candleInventoryMovements,
      route: "list_candle_inventory_movements",
    },
  ]);
  await listCandleTypes().then(({ data }) => {
    candleTypeOptions.value = data;
  });
  await searchMovements();
});
</script>

<style scoped></style>
