<template>
  <div class="mb-5 flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Listado de clientes</span>
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
</template>
<script setup>
import EmptyView from "@/components/general/EmptyView.vue";
import { breadCrumbsLabels } from "@/core/constants.js";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { listCustomers } from "@/services/customers/customer.service.js";

const mainStore = useMainStore();

const customers = ref([]);
const paginator = ref({
  page_number: 1,
  page_size: 10,
  total: 0,
});

const getCustomersList = async () => {
  await listCustomers(paginator.value.page_size, paginator.value.page_number).then(({ data }) => {
    customers.value = data.customers;
    paginator.value.total = data.total;
  });
};

const onPageChange = (event) => {
  paginator.value.page_size = event.rows;
  paginator.value.page_number = event.first + 1;
  getCustomersList();
};

const editCustomer = (email) => {
  console.log(email);
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
