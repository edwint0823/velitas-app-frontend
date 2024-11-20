<template>
  <Dialog
    v-model:visible="modalVisible"
    modal
    :header="`Detalle de pedido Nro ${orderInfo.code}`"
    maximizable
    :style="{ 'min-width': '70vw' }"
    :breakpoints="{ '1199px': '85vw', '575px': '90vw' }"
  >
    <div class="mb-5 grid grid-cols-1 gap-1 md:grid-cols-3">
      <span><strong>Cliente:</strong> {{ orderInfo.customerName }}</span>
      <span><strong>Tipo de cliente:</strong> {{ orderInfo.customerPriceType }}</span>
      <span><strong>Número telefónico:</strong> {{ orderInfo.customerPhoneNumber }}</span>
      <span><strong>Fecha de entrega:</strong> {{ orderInfo.deliveryDate }}</span>
      <span><strong>Dirección de entrega:</strong> {{ orderInfo.deliveryAddress }}</span>
      <span><strong>Precio de entrega:</strong> {{ $h.formatCurrency(orderInfo.deliveryPrice, 0) }}</span>
      <span><strong>Fecha de creación:</strong> {{ orderInfo.createdAt }}</span>
      <span><strong>Cantidad total:</strong> {{ orderInfo.totalQuantity }}</span>
      <span><strong>Precio total:</strong> {{ $h.formatCurrency(orderInfo.totalPrice, 2) }}</span>
      <span><strong>Información adicional:</strong> {{ orderInfo.additionalInfo }}</span>
    </div>
    <div class="mb-5">
      <Accordion :active-index="[2]" :multiple="true">
        <AccordionTab header="Pagos realizados">
          <div v-if="!orderInfo.payments.length">
            <EmptyView
              image-url="/images/empty-money.svg"
              message="No hay pagos registrados para este pedido"
              image-class="w-1/2 md:w-1/5"
            />
          </div>
          <div v-else>
            <DataTable :value="orderInfo.payments">
              <Column header="Parcial/Total">
                <template #body="{ data }">
                  <span>{{ data.isPartial ? "Parcial" : "Total" }}</span>
                </template>
              </Column>
              <Column field="bankEntityName" header="Banco" />
              <Column header="Valor">
                <template #body="{ data }">
                  <span>{{ $h.formatCurrency(data.amount, 2) }}</span>
                </template>
              </Column>
              <Column field="createdAt" header="Fecha de pago" />
              <template #footer>
                <div class="flex justify-end">
                  <label>
                    Total:
                    {{ $h.formatCurrency(orderInfo.payments.reduce((acc, val) => (acc += val.amount), 0)) }}</label
                  >
                </div>
              </template>
            </DataTable>
          </div>
        </AccordionTab>
        <AccordionTab header="Bolsas a usar">
          <DataTable :value="orderInfo.bagsNeed">
            <Column field="name" header="Tipo de bolsa" />
            <Column field="quantity" header="Cantidad" />
          </DataTable>
        </AccordionTab>
        <AccordionTab header="Detalles">
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
                    <span><strong>Cantidad:</strong> {{ order.quantity }}</span>
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
        </AccordionTab>
      </Accordion>
    </div>
  </Dialog>
</template>
<script setup>
import { ref } from "vue";
import { getDetailAndBags } from "@/services/orders/order.service.js";
import EmptyView from "@/components/general/EmptyView.vue";

const modalVisible = ref(false);
const orderInfo = ref({
  code: "",
  totalPrice: 0,
  totalQuantity: 0,
  deliveryDate: "",
  createdAt: "",
  customerName: "",
  customerPriceType: "",
  customerPhoneNumber: "",
  statusName: "",
  statusPublicName: "",
  deliveryPrice: 0,
  deliveryAddress: "",
  additionalInfo: null,
  bagsNeed: [],
  details: [],
  payments: [],
});
const openModal = async (order) => {
  orderInfo.value.code = order.code;
  await getDetailAndBags(order.code).then(({ data }) => {
    orderInfo.value.totalPrice = data.totalPrice;
    orderInfo.value.totalQuantity = data.totalQuantity;
    orderInfo.value.deliveryDate = data.deliveryDate;
    orderInfo.value.createdAt = data.createdAt;
    orderInfo.value.customerName = data.customerName;
    orderInfo.value.customerPriceType = data.customerPriceType;
    orderInfo.value.customerPhoneNumber = data.customerPhoneNumber;
    orderInfo.value.statusName = data.statusName;
    orderInfo.value.statusPublicName = data.statusPublicName;
    orderInfo.value.deliveryPrice = data.deliveryPrice;
    orderInfo.value.deliveryAddress = data.deliveryAddress;
    orderInfo.value.additionalInfo = data.additionalInfo;
    orderInfo.value.details = data.orderDetails;
    orderInfo.value.bagsNeed = data.bagsNeed;
    orderInfo.value.payments = data.payments;
    modalVisible.value = true;
  });
};

defineExpose({ openModal });
</script>
<style scoped></style>
