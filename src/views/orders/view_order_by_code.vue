<template>
  <span class="flex justify-center text-center font-bold text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl p-2">
    Información del pedido Nro {{ route.params.code }}
  </span>
  <Card class="my-5">
    <template #header>
      <span class="text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-semibold">
        Información general
      </span>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-2">
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
          <span>{{ $dayjs(orderInfo.deliveryDate).format('MMMM DD [de] YYYY') }}</span>
        </div>
        <div class="flex flex-col">
          <span class="font-semibold">Estado</span>
          <span
              class="font-bold"
              :class="orderInfo.publicStatusName === statusPublicNameCancel ? 'text-red-700' : 'text-emerald-700'">
            {{ orderInfo.publicStatusName }}
          </span>
        </div>
      </div>
      <!--      <div>-->
      <!--        <span>NOTA</span>-->
      <!--      </div>-->
    </template>
  </Card>
  <span class="font-semibold text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl px-2">Detalles del pedido</span>
  <DataView :value="orderInfo.orderDetails" layout="list" class="my-5">
    <template #empty>
      <div class="flex justify-center">
        No hay velas por mostrar
      </div>
    </template>
    <template #list="slotProps">
      <div class="my-5">
        <div v-for="(candle, index) in slotProps.items" :key="index"
             class="grid grid-cols-1 lg:grid-cols-10 mx-5 py-2 gap-7 border-slate-300 dark:border-slate-500"
             :class="{'border-b' : index < slotProps.items.length -1}"
        >
          <div class=" col-span-1 lg:col-span-2 flex flex-col justify-center items-center">
            <span class="text-sm mb-2 dark:text-white/70 text-surface-500">Tipo de vela</span>
            <img :src="candle.candleOptionUrlImage" :alt="candle.candleOptionName" class="w-[250px] h-[70px]">
            <span>{{ candle.candleOptionName }}</span>
          </div>
          <div class="col-span-1 lg:col-span-7 flex flex-col">
            <span class="text-sm mb-5 dark:text-white/70 text-surface-500">Nombres</span>
            <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2"
            >
              <div v-for="(candleName, index2) in candle.nameList" :key="index2">
                <div
                    class="flex flex-col bg-surface-200 dark:bg-surface-900 dark:text-surface-0/80 text-surface-700 rounded-lg p-2"
                >
                  <span class="border-b border-surface-200 dark:border-surface-800 py-1 text-center w-full">
                    {{ candleName.name }}
                  </span>
                  <span>¿ Empacar solo ?
                    <span :class="candleName.packAlone ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.packAlone ? 'Sí' : 'No' }}
                    </span>
                  </span>
                  <span>¿ Difunto ?
                    <span :class="candleName.deceased ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.deceased ? 'Sí' : 'No' }}
                    </span>
                  </span>
                  <span>¿ Mascota ?
                    <span :class="candleName.pet ? 'text-green-500' : 'text-red-500'">
                      {{ candleName.pet ? 'Sí' : 'No' }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <span class="text-sm dark:text-white/70 text-surface-500 mt-3 mb-2">Observaciones</span>
            <span class="">{{ candle.observation }}</span>
          </div>
          <div class="flex items-end flex-col">
            <span class="font-bold text-lg">{{ $h.formatCurrency(candle.price, 0) }}</span>
            <span class="font-bold text-lg">{{ candle.quantity }}</span>
          </div>
        </div>
      </div>
    </template>
  </DataView>
  <div class="flex justify-center pb-5"
       v-if="statusNameValidToCancel.includes(orderInfo.statusName.toLocaleLowerCase())">
    <Button severity="danger" icon="pi pi-times" label="Cancelar pedido" @click="cancelOrder"/>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {inject, onMounted, ref} from "vue";
import {
  baseStructureOrderDetailByCode,
  breadCrumbsLabels,
  statusNameValidToCancel,
  statusPublicNameCancel
} from "@/core/constants.js";
import {useMainStore} from "@/store/main.store.js";
import {getOrderByCode} from "@/services/orders/order.service.js";

const mainStore = useMainStore()
const route = useRoute()
const swal = inject('$swal')

const orderInfo = ref(baseStructureOrderDetailByCode)

const getOrderDetails = async () => {
  await getOrderByCode(route.params.code).then(({data}) => {
    orderInfo.value = data
  })
}

const cancelOrder = () => {
  swal({
    icon: 'question',
    title: '¿ Esta seguro ?',
    text: `Desea cancelar el pedido Nro. ${route.params.code}`,
    confirmButtonText: 'Si, cancelar el pedido',
    showDenyButton: true,
    denyButtonText: 'No'
  }).then(({value}) => {
    if (value) {
      console.log(route.params.code, 'Si')
    } else {
      console.log(route.params.code, 'No')
    }
  })
}
onMounted(async () => {
  console.log(route.params)
  await getOrderDetails()
  mainStore.setBreadcrumbs([
    {label: breadCrumbsLabels.order.main},
    {label: breadCrumbsLabels.order.viewOrderByCode, route: 'view_order_by_code'}
  ])

})
</script>