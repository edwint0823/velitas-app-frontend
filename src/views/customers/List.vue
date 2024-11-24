<template>
  <div class="p-2">
    <div class="mb-5 flex justify-between">
      <span class="text-2xl font-bold md:text-3xl">Listado de clientes</span>
      <Button icon="pi pi-plus" severity="success" v-tooltip="'Crear'" @click="createCustomer" />
    </div>
    <div class="py-4">
      <h2 class="mb-3 text-xl font-bold">Filtros</h2>
      <div class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Nombre</label>
          <InputText v-model="filters.name" type="text" placeholder="Nombre del cliente" />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Correo electrónico</label>
          <InputText
            v-model="filters.email"
            type="text"
            placeholder="Correo electrónico del cliente"
            autocomplete="nope"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-2 font-semibold">Número de telefono</label>
          <InputMask
            v-model="filters.phone_number"
            type="text"
            mask="999 999 9999"
            placeholder="999 999 9999"
            class="w-full"
            autocomplete="nope"
          />
        </div>
        <div class="flex items-end justify-center gap-4 md:justify-end">
          <Button label="Buscar" icon="pi pi-search" @click="searchCustomers" severity="info" />
          <Button label="Limpiar filtros" icon="pi pi-eraser" outlined severity="secondary" @click="clearFilters" />
        </div>
      </div>
    </div>
    <DataTable :value="customers">
      <template #empty>
        <EmptyView message="No hay clientes registrados" class="p-2" />
      </template>
      <Column header="Nombre" field="name"></Column>
      <Column header="Correo electrónico" field="email"></Column>
      <Column header="Número de telefono" field="phone_number"></Column>
      <Column header="Tipo de precios" field="price_type"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <div class="flex justify-center">
            <Button
              icon="pi pi-pencil"
              severity="warning"
              v-tooltip="'Editar'"
              @click="editCustomer(slotProps.data.email)"
            />
          </div>
        </template>
      </Column>
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
  </div>
  <modalCustomer ref="modalEditCustomerRef" :isEdit="true" @operation-finished="getCustomersList" />
  <modalCustomer ref="modalCreateCustomerRef" :isEdit="false" @operation-finished="getCustomersList" />
</template>
<script setup>
import EmptyView from "@/components/general/EmptyView.vue";
import { breadCrumbsLabels } from "@/core/constants.js";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { listCustomers } from "@/services/customers/customer.service.js";
import modalCustomer from "@/components/customer/ModalCustomer.vue";

const mainStore = useMainStore();

const customers = ref([]);
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});
const modalEditCustomerRef = ref();
const modalCreateCustomerRef = ref();
const filters = ref({
  name: "",
  email: "",
  phone_number: "",
});

const searchCustomers = async () => {
  paginator.value.page_number = 1;
  await getCustomersList();
};
const clearFilters = () => {
  paginator.value.page_number = 1;
  filters.value.name = null;
  filters.value.email = null;
  filters.value.phone_number = null;
};

const getCustomersList = async () => {
  const payload = {};
  if (filters.value.name !== null) {
    payload.name = filters.value.name.toUpperCase();
  }
  if (filters.value.email !== null) {
    payload.email = filters.value.email;
  }
  if (filters.value.phone_number !== null) {
    payload.phone_number = filters.value.phone_number;
  }
  await listCustomers(paginator.value.page_size, paginator.value.page_number, payload).then(({ data }) => {
    customers.value = data.customers;
    paginator.value.total = data.total;
  });
};

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = parseInt(event.page) + 1;
  getCustomersList();
};

const editCustomer = (email) => {
  modalEditCustomerRef.value.openModalCustomer(email, true);
};

const createCustomer = () => {
  modalCreateCustomerRef.value.openModalCustomer("", false);
};

onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.customers.main },
    {
      label: breadCrumbsLabels.customers.listCustomers,
      route: "list_customers",
    },
  ]);
  await getCustomersList();
});
</script>
