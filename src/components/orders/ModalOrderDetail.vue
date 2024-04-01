<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    :header="`Detalle de pedido Nro ${orderInfo.code}`"
    maximizable
    :style="{ 'min-width': '70vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '90vw' }"
  >
    <div class="mb-5 grid grid-cols-1 md:grid-cols-2">
      <span><strong>Cliente:</strong> {{ orderInfo.customer_name }}</span>
      <span><strong>Tipo de cliente:</strong> {{ orderInfo.customer_price_type }}</span>
      <span><strong>Fecha de entrega:</strong> {{ orderInfo.delivery_date }}</span>
      <span><strong>Fecha de creación:</strong> {{ orderInfo.created_at }}</span>
      <span><strong>Cantidad total:</strong> {{ orderInfo.total_quantity }}</span>
      <span><strong>Precio total:</strong> {{ $h.formatCurrency(orderInfo.total_price, 2) }}</span>
    </div>
    <div>
      <span class="text-lg font-bold">Detalles</span>
      <DataView layout="grid" :value="orderInfo.details">
        <template #grid>
          <div class="grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="order in orderInfo.details"
              class="rounded-xl border border-surface-500 p-4 dark:border-surface-200"
            >
              <div class="flex flex-col items-center">
                <img :src="order.candleOptionUrlImage" :alt="order.candleOptionName" class="w-1/2" />
                <span class="mt-2 font-semibold">{{ order.candleOptionName }}</span>
              </div>
              <div class="mb-5 mt-3 grid grid-cols-1 sm:grid-cols-2">
                <span><strong>Precio:</strong> {{ $h.formatCurrency(order.price, 2) }}</span>
                <span><strong>Precio:</strong> {{ order.quantity }}</span>
              </div>
              <div class="flex flex-col">
                <span class="mb-3 font-semibold">Nombres</span>
                <DataTable size="small" :value="order.nameList">
                  <Column field="name" header="Nombre" />
                  <Column header="Empacar solo">
                    <template #body="{ data }">
                      <span>{{ data.packAlone ? "Si" : "No" }}</span>
                    </template>
                  </Column>
                  <Column header="Difunto">
                    <template #body="{ data }">
                      <span>{{ data.deceased ? "Si" : "No" }}</span>
                    </template>
                  </Column>
                  <Column header="Mascota">
                    <template #body="{ data }">
                      <span>{{ data.pet ? "Si" : "No" }}</span>
                    </template>
                  </Column>
                </DataTable>
                <span class="mb-3 mt-4 font-semibold">Observaciones</span>
                <span>{{ order.observation }}</span>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </Dialog>
</template>
<script setup>
import { ref } from "vue";
import { getOrderByCode } from "@/services/orders/order.service.js";

const modalVisible = ref(false);
const orderInfo = ref({
  code: "",
  total_price: 0,
  total_quantity: 0,
  delivery_date: "",
  created_at: "",
  customer_name: "",
  customer_price_type: "",
  status_name: "",
  status_public_name: "",
  details: [],
});
const openModal = async (order) => {
  orderInfo.value.code = order.code;
  orderInfo.value.total_price = order.total_price;
  orderInfo.value.total_quantity = order.total_quantity;
  orderInfo.value.delivery_date = order.delivery_date;
  orderInfo.value.created_at = order.created_at;
  orderInfo.value.customer_name = order.customer_name;
  orderInfo.value.customer_price_type = order.customer_price_type;
  orderInfo.value.status_name = order.status_name;
  orderInfo.value.status_public_name = order.status_public_name;
  await getOrderByCode(order.code).then(({ data }) => {
    orderInfo.value.details = data.orderDetails;
  });
  console.log(orderInfo.value);
  modalVisible.value = true;
};

defineExpose({ openModal });
</script>
<style scoped></style>
