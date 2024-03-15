<template>
  <span class="flex justify-center p-2 text-center text-2xl font-bold lg:text-3xl xl:text-3xl 2xl:text-3xl">
    Información del pedido Nro {{ code }}
  </span>
  <Card class="my-5">
    <template #header>
      <span class="text-xl font-semibold lg:text-2xl xl:text-2xl 2xl:text-2xl"> Información general </span>
    </template>
    <template #content>
      <div class="grid grid-cols-1 gap-2 px-2 md:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col">
          <span class="font-semibold">Cliente</span>
          <span>{{ orderInfo.customerName }}</span>
        </div>
        <div class="flex flex-col">
          <span class="font-semibold">Valor Total</span>
          <span>{{ $h.formatCurrency(orderInfo.totalPrice) }}</span>
        </div>
        <div class="flex flex-col">
          <span class="font-semibold">Fecha estimada de entrega</span>
          <span>
            {{ $dayjs(orderInfo.deliveryDate).format("MMMM DD [de] YYYY") }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="font-semibold">Estado</span>
          <span
            class="font-bold"
            :class="orderInfo.publicStatusName === statusPublicNameCancel ? 'text-red-700' : 'text-emerald-700'"
          >
            {{ orderInfo.publicStatusName }}
          </span>
        </div>
      </div>
      <!--      <div>-->
      <!--        <span>NOTA</span>-->
      <!--      </div>-->
    </template>
  </Card>
  <span class="px-2 text-2xl font-semibold lg:text-3xl xl:text-3xl 2xl:text-3xl">Detalles del pedido</span>
  <DataView :value="orderInfo.orderDetails" layout="list" class="my-5">
    <template #empty>
      <div class="flex justify-center">No hay velas por mostrar</div>
    </template>
    <template #list="slotProps">
      <div class="my-5">
        <div
          v-for="(candle, index) in slotProps.items"
          :key="index"
          class="mx-5 grid grid-cols-1 gap-7 border-slate-300 py-2 lg:grid-cols-10 dark:border-slate-500"
          :class="{ 'border-b': index < slotProps.items.length - 1 }"
        >
          <div class="col-span-1 flex flex-col items-center justify-center lg:col-span-2">
            <span class="mb-2 text-sm text-surface-500 dark:text-white/70"> Tipo de vela </span>
            <img :src="candle.candleOptionUrlImage" :alt="candle.candleOptionName" class="h-[70px] w-[250px]" />
            <span>{{ candle.candleOptionName }}</span>
          </div>
          <div class="col-span-1 flex flex-col lg:col-span-7">
            <span class="mb-5 text-sm text-surface-500 dark:text-white/70"> Nombres </span>
            <div
              class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6"
            >
              <div v-for="(candleName, index2) in candle.nameList" :key="index2">
                <div
                  class="flex flex-col rounded-lg bg-surface-200 p-2 text-surface-700 dark:bg-surface-900 dark:text-surface-0/80"
                >
                  <span class="w-full border-b border-surface-200 py-1 text-center dark:border-surface-800">
                    {{ candleName.name }}
                  </span>
                  <span>
                    ¿ Empacar solo ?
                    <span :class="candleName.packAlone ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.packAlone ? "Sí" : "No" }}
                    </span>
                  </span>
                  <span>
                    ¿ Difunto ?
                    <span :class="candleName.deceased ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.deceased ? "Sí" : "No" }}
                    </span>
                  </span>
                  <span>
                    ¿ Mascota ?
                    <span :class="candleName.pet ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.pet ? "Sí" : "No" }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <span class="mb-2 mt-3 text-sm text-surface-500 dark:text-white/70"> Observaciones </span>
            <span>{{ candle.observation }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-lg font-bold">
              {{ $h.formatCurrency(candle.price, 0) }}
            </span>
            <span class="text-lg font-bold">{{ candle.quantity }}</span>
          </div>
        </div>
      </div>
    </template>
  </DataView>
  <div
    class="flex justify-center pb-5"
    v-if="statusNameValidToCancel.includes(orderInfo.statusName.toLocaleLowerCase())"
  >
    <Button severity="danger" icon="pi pi-times" label="Cancelar pedido" @click="cancelOrder" />
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { baseStructureOrderDetailByCode, statusNameValidToCancel, statusPublicNameCancel } from "@/core/constants.js";

const swal = inject("$swal");

const orderInfo = ref(baseStructureOrderDetailByCode);
const code = ref("0");
const loadOrder = (order, orderCode) => {
  orderInfo.value = order;
  code.value = orderCode;
};

const cancelOrder = () => {
  swal({
    icon: "question",
    title: "¿ Esta seguro ?",
    text: `Desea cancelar el pedido Nro. ${code.value}`,
    confirmButtonText: "Si, cancelar el pedido",
    showDenyButton: true,
    denyButtonText: "No",
  }).then(({ value }) => {
    if (value) {
      console.log(code.value, "Si");
    } else {
      console.log(code.value, "No");
    }
  });
};

defineExpose({ loadOrder });
</script>
