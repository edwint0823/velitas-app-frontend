<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Listado de opciones de vela</span>
  </div>
  <Card class="mb-5 mt-4">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-y-3 md:grid-cols-5">
        <div class="flex flex-col">
          <label for="candle_type">Tipo de vela:</label>
          <Dropdown
            v-model="filters.candle_type_id"
            :options="candleTypesOptions"
            input-id="candle_type"
            option-label="name"
            option-value="id"
            placeholder="Seleccione un tipo de vela"
          />
        </div>
        <div class="flex flex-col items-center gap-2">
          <label>Visible</label>
          <div class="flex items-center justify-center gap-8">
            <RadioButton v-model="filters.visible" inputId="visible1" name="Si" :value="true" />
            <label for="visible1" class="ml-2">Si</label>
            <RadioButton v-model="filters.visible" inputId="visible2" name="No" :value="false" />
            <label for="visible2" class="ml-2">No</label>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <label>Es paquete</label>
          <div class="flex items-center justify-center gap-8">
            <RadioButton v-model="filters.is_pack" inputId="isPack1" name="Si" :value="true" />
            <label for="isPack1" class="ml-2">Si</label>
            <RadioButton v-model="filters.is_pack" inputId="isPack2" name="No" :value="false" />
            <label for="isPack2" class="ml-2">No</label>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <label>Es paquete VIP</label>
          <div class="flex items-center justify-center gap-8">
            <RadioButton v-model="filters.is_vip_pack" inputId="isVipPack1" name="Si" :value="true" />
            <label for="isVipPack1" class="ml-2">Si</label>
            <RadioButton v-model="filters.is_vip_pack" inputId="isVipPack2" name="No" :value="false" />
            <label for="isVipPack2" class="ml-2">No</label>
          </div>
        </div>
        <div class="flex items-end justify-center gap-4 md:justify-end">
          <Button label="Buscar" icon="pi pi-search" @click="paginateAllCandleOptions" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <div class="mb-4 flex items-center justify-end">
    <Button label="Agregar opción" icon="pi pi-plus" @click="$router.push({ name: 'create_candle_option' })" />
  </div>
  <DataView :value="candleOptionsList" layout="list">
    <template #empty>
      <EmptyView message="No hay opciones de velas por mostrar con los filtros aplicados" class="p-2" />
    </template>
    <template #list>
      <div class="p-1">
        <div
          v-for="candleOption in candleOptionsList"
          class="m-2 rounded-xl border border-surface-400/80 p-3 dark:border-surface-500/80"
        >
          <div class="grid grid-cols-1 md:grid-cols-7">
            <div class="col-span-1 md:col-span-2">
              <img :src="candleOption.urlImage" :alt="candleOption.name" class="w-[75%]" />
            </div>
            <div class="col-span-1 flex flex-col md:col-span-4">
              <div class="my-2 flex flex-wrap gap-4">
                <span class="text-xl font-semibold">{{ candleOption.name }}</span>
                <Tag :severity="candleOption.visible ? 'success' : 'warning'">
                  {{ candleOption.visible ? "Visible" : "No visible" }}
                </Tag>
                <Tag :severity="'info'" v-if="candleOption.isPack"> Paquete</Tag>
                <Tag :severity="'success'" v-if="candleOption.isVipPack"> Paquete VIP</Tag>
              </div>
              <span class="font-light">Tipo de vela: {{ candleOption.candleTypeName }}</span>
              <span class="font-light">Precio mayorista: {{ $h.formatCurrency(candleOption.bulkPrice, 0) }}</span>
              <span class="font-light">Precio detal: {{ $h.formatCurrency(candleOption.retailPrice, 0) }}</span>
              <div class="mt-3 flex flex-col gap-2" v-if="candleOption.packNames.length">
                <span class="font-light">Nombres: </span>
                <div class="flex flex-wrap">
                  <Chip :label="name" v-for="name of candleOption.packNames" class="text-lg" />
                </div>
              </div>
            </div>
            <div class="col-span-1 mt-3 flex items-center justify-center md:mt-0">
              <Button
                severity="warning"
                icon="pi pi-pencil"
                label="Editar"
                @click="$router.push({ name: 'edit_candle_option', params: { id: candleOption.id } })"
              />
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
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { getCandleOptionsPaginated } from "@/services/candleOptions/candleOptions.service.js";
import { listCandleTypes } from "@/services/candleType/candleType.service.js";
import EmptyView from "@/components/general/EmptyView.vue";
import { breadCrumbsLabels } from "@/core/constants.js";

const mainStore = useMainStore();

const candleOptionsList = ref([]);
const candleTypesOptions = ref([{ id: 0, name: "" }]);

const filters = ref({
  is_vip_pack: null,
  visible: null,
  candle_type_id: null,
  is_pack: null,
});
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});

const paginateAllCandleOptions = async () => {
  const payload = {};
  if (filters.value.is_vip_pack) {
    payload["is_vip_pack"] = filters.value.is_vip_pack;
  }
  if (filters.value.visible) {
    payload["visible"] = filters.value.visible;
  }
  if (filters.value.candle_type_id) {
    payload["candle_type_id"] = filters.value.candle_type_id;
  }
  if (filters.value.is_pack) {
    payload["is_pack"] = filters.value.is_pack;
  }

  await getCandleOptionsPaginated(paginator.value.page_size, paginator.value.page_number, payload).then(({ data }) => {
    candleOptionsList.value = data.options;
    paginator.value.total = data.total;
  });
};

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number =
    parseInt(event.first) === 0
      ? parseInt(event.first) + 1
      : event.pageCount
        ? event.pageCount
        : parseInt(event.first) + 1;
  paginateAllCandleOptions();
};

const clearFilters = async () => {
  filters.value.is_vip_pack = null;
  filters.value.visible = null;
  filters.value.candle_type_id = null;
  filters.value.is_pack = null;
  await paginateAllCandleOptions();
};

onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.configuration.main },
    {
      label: breadCrumbsLabels.configuration.main,
      route: "list_candle_options",
    },
  ]);
  await listCandleTypes().then(({ data }) => {
    candleTypesOptions.value = data;
  });
  await paginateAllCandleOptions();
});
</script>
