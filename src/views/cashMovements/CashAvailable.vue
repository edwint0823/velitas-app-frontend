<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Inventario de dinero físico disponible</span>
  </div>
  <Card class="mb-5 mt-4" size="small">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-y-3 md:grid-cols-3">
        <div class="col-span-1 flex flex-col md:col-span-2">
          <label for="candle_name">Nombre:</label>
          <InputText id="candle_name" v-model="filters.name" placeholder="Nombre de una moneda" class="max-w-[300px]" />
        </div>
        <div class="flex items-end justify-center gap-4 md:justify-end">
          <Button label="Buscar" icon="pi pi-search" @click="getCashInventory" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div v-for="(bank, index) in bankEntities" :key="index" v-if="bankEntities.length">
      <div
        class="grid h-[70px] grid-cols-4 items-center rounded-lg bg-surface-0 p-3 text-surface-700 dark:bg-surface-800 dark:text-white/80"
      >
        <img :alt="bank.name" :src="`/icons/${convertBankNameToFileName(bank.name)}.webp`" class="w-[45px]" />
        <span class="col-span-2 text-lg font-bold">{{ bank.name }}</span>
        <span class="text-lg font-semibold">{{ $h.formatCurrency(bank.amount, 0) }}</span>
      </div>
    </div>
  </div>
  <DataTable :value="cashInventoryList">
    <template #empty>
      <EmptyView message="No se encontraron items con los filtros aplicados" />
    </template>
    <Column field="name" header="Nombre" />
    <Column field="quantity" header="Cantidad" />
    <Column header="Valor">
      <template #body="slotProps">
        <span>{{ $h.formatCurrency(slotProps.data.quantity * slotProps.data.unitValue, 0) }}</span>
      </template>
    </Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" label="Editar" @click="editInventoryItem(slotProps.data.id)" />
      </template>
    </Column>
  </DataTable>
  <ModalEditCashInventoryQuantity ref="modalEditCashInventoryQuantityRef" @quantity-updated="getCashInventory" />
  <div class="mt-2">
    <span class="text-xl font-semibold"> Total: {{ $h.formatCurrency(total, 0) }} </span>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { listCashInventory } from "@/services/cashMovements/cashMovement.service.js";
import ModalEditCashInventoryQuantity from "@/components/cashMovements/ModalEditCashInventoryQuantity.vue";
import EmptyView from "@/components/general/EmptyView.vue";
import { getAllBanksWithAmounts } from "@/services/bankEntities/bankEntity.service.js";
import { breadCrumbsLabels } from "@/core/constants.js";

const mainStore = useMainStore();
const filters = ref({
  name: "",
});
const cashInventoryList = ref([]);
const bankEntities = ref([]);
const modalEditCashInventoryQuantityRef = ref();

const total = computed(() => {
  if (!cashInventoryList.value.length) return 0;

  return cashInventoryList.value.reduce((acc, val) => acc + val.quantity * val.unitValue, 0);
});

const getCashInventory = async () => {
  const payload = {};
  if (filters.value.name !== "") payload["name"] = filters.value.name;
  await listCashInventory(payload).then(({ data }) => {
    cashInventoryList.value = data;
  });
  await getAllBanksWithAmounts().then(({ data }) => {
    bankEntities.value = data;
  });
};

const clearFilters = () => {
  filters.value.name = "";
  getCashInventory();
};

const editInventoryItem = (id) => {
  modalEditCashInventoryQuantityRef.value.openModal(id);
};

const convertBankNameToFileName = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
};
onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.cashMovements.main },
    {
      label: breadCrumbsLabels.cashMovements.cashAvailable,
      route: "cash_available",
    },
  ]);
  await getCashInventory();
});
</script>

<style scoped></style>
