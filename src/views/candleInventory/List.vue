<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Inventario de velas</span>
  </div>
  <Card class="mb-5 mt-4">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-y-3 md:grid-cols-3">
        <div class="col-span-1 flex flex-col md:col-span-2">
          <label for="candle_name">Nombre:</label>
          <InputText id="candle_name" v-model="filters.name" placeholder="Nombre de una vela" class="max-w-[300px]" />
        </div>
        <div class="flex items-end justify-center gap-4 md:justify-end">
          <Button label="Buscar" icon="pi pi-search" @click="getCandleInventory" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <DataView :value="candles" layout="grid">
    <template #empty>
      <EmptyView message="No hay velas por mostrar con los filtros aplicados" class="p-2" />
    </template>
    <template #grid="slotProps">
      <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="(item, index) in slotProps.items" :key="index">
          <div class="flex flex-col rounded-lg border border-surface-400/80 p-4 dark:border-surface-500/80">
            <div class="flex content-center rounded-lg bg-surface-300/50 p-2 dark:bg-surface-700/80">
              <div class="relative mx-auto">
                <img src="/images/candle_item.webp" alt="img vela" class="w-48 rounded-lg" />
                <Tag
                  :value="item.inventoryStatus"
                  :severity="getSeverity(item.inventoryStatus)"
                  class="absolute left-[4px] top-[4px]"
                />
              </div>
            </div>
            <div class="mt-2 flex justify-between">
              <span class="text-lg font-semibold">{{ item.name }}</span>
              <Button
                icon="pi pi-plus"
                v-tooltip="'Registrar movimiento de inventario'"
                rounded
                @click="openModalRegister(item)"
              />
            </div>
            <span>{{ item.quantity }} Unidades</span>
          </div>
        </div>
      </div>
    </template>
  </DataView>
  <ModalCreateInventoryMovement ref="modalCandleInventoryMovementRef" @modal-closed="getCandleInventory" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import EmptyView from "@/components/general/EmptyView.vue";
import { listCandleInventory } from "@/services/candlesInventory/candleInventory.service.js";
import ModalCreateInventoryMovement from "@/components/candleInventory/ModalCreateInventoryMovement.vue";
import { breadCrumbsLabels } from "@/core/constants.js";

const mainStore = useMainStore();

const filters = ref({
  name: "",
});
const candles = ref([]);
const modalCandleInventoryMovementRef = ref();

const getCandleInventory = async () => {
  const payload = {};
  if (filters.value.name !== "") payload["name"] = filters.value.name;

  await listCandleInventory(payload).then(({ data }) => {
    candles.value = data;
  });
};

const clearFilters = () => {
  filters.value.name = "";
  getCandleInventory();
};

const openModalRegister = (candle) => {
  modalCandleInventoryMovementRef.value.openModal(candle);
};

const getSeverity = (status) => {
  switch (status) {
    case "AGOTADO":
      return "danger";

    case "EN STOCK":
      return "success";

    case "INVENTARIO BAJO":
      return "warning";
  }
};

onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.inventory.main },
    {
      label: breadCrumbsLabels.inventory.candleInventory,
      route: "list_candle_inventory",
    },
  ]);
  await getCandleInventory();
});
</script>
