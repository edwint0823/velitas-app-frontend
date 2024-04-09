<template>
  <Dialog
    v-model:visible="modalStatusVisible"
    modal
    :header="`Actualizar estado del pedido Nro ${orderInfo.code}`"
    :style="{ 'min-width': '45vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :auto-z-index="false"
  >
    <div class="flex flex-col gap-3 pb-4">
      <span class="font-semibold">Seleccione el nuevo estado del pedido</span>
      <Dropdown
        v-model="orderInfo.newStatusId"
        :options="statusOptionList"
        optionLabel="name"
        option-value="id"
        placeholder="selecciona un stado"
      />
    </div>
    <div class="flex justify-center">
      <Button label="Actualizar" icon="pi pi-save" @click="update" />
    </div>
  </Dialog>
</template>
<script setup>
import { inject, ref } from "vue";
import { statusListByOrder } from "@/services/status/status.service.js";
import { updateOrderStatusMessages } from "@/core/constants.js";
import { updateOrderStatus } from "@/services/orders/order.service.js";

const emit = defineEmits(["orderStatusUpdated"]);

const swal = inject("$swal");
const modalStatusVisible = ref(false);
const orderInfo = ref({
  statusId: 0,
  code: "",
  newStatusId: 0,
});
const statusOptionList = ref([]);

const openStatusModal = async (orderData) => {
  await statusListByOrder(orderData.status_order).then(({ data }) => {
    statusOptionList.value = data;
  });
  orderInfo.value.statusId = orderData.status_id;
  orderInfo.value.newStatusId = orderData.status_id;
  orderInfo.value.code = orderData.code;
  modalStatusVisible.value = true;
};

const update = async () => {
  if (orderInfo.value.statusId === orderInfo.value.newStatusId) {
    swal({
      icon: "warning",
      title: updateOrderStatusMessages.sameStatusErrorTitle,
      text: updateOrderStatusMessages.sameStatusErrorText,
    });
    return;
  }
  await updateOrderStatus(orderInfo.value.code, orderInfo.value.newStatusId).then(({ data }) => {
    swal({
      icon: "success",
      title: updateOrderStatusMessages.updateSuccessTitle,
      text: data.message,
    }).then(() => {
      orderInfo.value.statusId = 0;
      orderInfo.value.newStatusId = 0;
      orderInfo.value.code = "";
      modalStatusVisible.value = false;
      emit("orderStatusUpdated");
    });
  });
};

defineExpose({ openStatusModal });
</script>

<style scoped></style>
