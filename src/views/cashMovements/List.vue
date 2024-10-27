<template>
  <div class="flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Transacciones</span>
  </div>
  <Card class="mb-5 mt-4">
    <template #title>Filtros</template>
    <template #content>
      <div class="grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
        <div class="md:col-span-0 col-span-1 flex flex-col lg:col-span-2">
          <label class="mb-2 font-semibold">Nro Pedido(s)</label>
          <Chips v-model="filters.orders_code" separator="," placeholder="Nro pedido(s) separado por coma (,)" />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Entidad Bancaria</label>
          <Dropdown
            placeholder="Seleccione un banco"
            v-model="filters.bank_entity"
            :options="bankEntityList"
            option-label="name"
            option-value="id"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="align-items-center flex">
                <img
                  :alt="getNameOfBankOption(slotProps.value, true)"
                  :src="`/icons/${getNameOfBankOption(slotProps.value, true)}.webp`"
                  class="mr-2 w-[18px]"
                />
                <div>{{ getNameOfBankOption(slotProps.value) }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="align-items-center flex">
                <img
                  :alt="getNameOfBankOption(slotProps.option.id, true)"
                  :src="`/icons/${getNameOfBankOption(slotProps.option.id, true)}.webp`"
                  class="mr-2 w-[18px]"
                />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
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
            <label for="out_movement">Gasto</label>
          </div>
        </div>
        <div class="col-span-1 flex items-end justify-center gap-4 sm:justify-end lg:col-span-4">
          <Button label="Buscar" icon="pi pi-search" @click="searchMovements" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </template>
  </Card>
  <div class="mb-4 flex items-center justify-end">
    <Button label="Agregar gasto" icon="pi pi-plus" @click="createOutMovement" />
  </div>
  <div v-if="!movements.length">
    <EmptyView message="No se encontraron transacciones con los filtros aplicados" />
  </div>
  <div v-else>
    <DataView :value="movements" layout="list">
      <template #empty>
        <EmptyView message="No hay movimientos por mostrar con los filtros aplicados" class="p-2" />
      </template>
      <template #list>
        <div class="p-1">
          <div
            v-for="movement in movements"
            class="m-2 rounded-xl border border-surface-400/80 p-3 dark:border-surface-500/80"
          >
            <div class="grid grid-cols-1 lg:grid-cols-10">
              <div class="col-span-1 flex items-center justify-center">
                <img
                  :alt="movement.bankEntityName"
                  :src="`/icons/${convertBankNameToFileName(movement.bankEntityName)}.webp`"
                  class="m-3 w-[50px]"
                />
                <i
                  :class="`pi pi-arrow-${movement.entryMovement ? 'up' : 'down'} text-${movement.entryMovement ? 'green' : 'red'}-500 `"
                  class="m-4 text-3xl"
                ></i>
              </div>
              <div class="col-span-1 flex flex-col lg:col-span-8">
                <div class="flex gap-5">
                  <span class="text-xl font-bold">
                    {{ movement.concept }}
                  </span>
                  <Tag :severity="movement.isPaymentPartial ? 'info' : 'success'" v-if="movement.orderCode !== null">
                    {{ movement.isPaymentPartial ? "Parcial" : "Total" }}
                  </Tag>
                </div>
                <span class="font-semibold"> {{ movement.createdAt }} </span>
                <span class="font-semibold"> {{ movement.bankEntityName }} </span>
                <span class="font-semibold" v-if="movement.orderCode !== null">
                  Nro. pedido: {{ movement.orderCode }}
                </span>
                <span class="font-semibold"> Registrado por: {{ movement.createdByName }} </span>
              </div>
              <div class="col-span-1 flex items-start justify-center">
                <span class="text-xl font-bold" :class="`text-${movement.entryMovement ? 'green' : 'red'}-500 `">
                  {{ $h.formatCurrency(movement.amount, 0) }}
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
  </div>
  <ModalCreateOutMovements ref="modalCreateOutMovementRef" @out-movement-created="searchMovements" />
</template>
<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { getBankEntitiesList } from "@/services/bankEntities/bankEntity.service.js";
import { helper } from "@/utils/helper.js";
import EmptyView from "@/components/general/EmptyView.vue";
import { paginateListMovements } from "@/services/cashMovements/cashMovement.service.js";
import { useDayJs } from "@/utils/useDayJs.js";
import { breadCrumbsLabels, paginateListCashMovements } from "@/core/constants.js";
import ModalCreateOutMovements from "@/components/cashMovements/ModalCreateOutMovements.vue";

const dayjs = useDayJs();
const swal = inject("$swal");
const mainStore = useMainStore();

const isMobile = computed(() => {
  return helper.isMobileDevice();
});

const modalCreateOutMovementRef = ref();
const bankEntityList = ref([]);
const movements = ref([]);
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});
const filters = ref({
  orders_code: [],
  bank_entity: null,
  out_movement: false,
  entry_movement: false,
  created_at_begin: null,
  created_at_end: null,
});

const getNameOfBankOption = (id, fileType = false) => {
  const bankSelected = bankEntityList.value.find((opt) => opt.id === id);
  if (!bankSelected) return "";
  if (fileType) {
    return convertBankNameToFileName(bankSelected.name);
  }
  return bankSelected.name;
};

const convertBankNameToFileName = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
};

const searchMovements = async () => {
  if (
    filters.value.created_at_begin !== null &&
    filters.value.created_at_end !== null &&
    dayjs(filters.value.created_at_end).isBefore(filters.value.created_at_begin)
  ) {
    swal({
      icon: "warning",
      title: paginateListCashMovements.validateFiltersTittle,
      text: paginateListCashMovements.createdAtFilterError,
    });
    return;
  }
  const payload = {};
  if (filters.value.orders_code.length) {
    payload["orders_code"] = filters.value.orders_code.join(",");
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

  await paginateListMovements(paginator.value.page_size, paginator.value.page_number, payload).then(({ data }) => {
    movements.value = data.movements;
    paginator.value.total = data.total;
  });
};

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = parseInt(event.page) + 1;
  searchMovements();
};

const clearFilters = () => {
  filters.value.orders_code = [];
  filters.value.bank_entity = null;
  filters.value.out_movement = false;
  filters.value.entry_movement = false;
  filters.value.created_at_begin = null;
  filters.value.created_at_end = null;
  searchMovements();
};

const createOutMovement = () => {
  modalCreateOutMovementRef.value.openModalCreateOutMovement();
};
onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.cashMovements.main },
    {
      label: breadCrumbsLabels.cashMovements.transactions,
      route: "list_cash_movements",
    },
  ]);
  await getBankEntitiesList().then(({ data }) => {
    bankEntityList.value = data;
  });
  await searchMovements();
});
</script>
<style scoped></style>
