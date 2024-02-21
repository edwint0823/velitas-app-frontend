<template>
  <div>
    <Card>
      <template #title>
        <div class="flex flex-wrap align-items-center justify-between gap-2 rounded-lg">
          <span class="text-xl text-900 font-bold">Listado de velas</span>
          <Button icon="pi pi-plus" rounded raised @click="addCandle" v-tooltip="'Agregar vela'"/>
        </div>
      </template>
      <template #content>
        <DataView :value="candles" layout="list" class="mb-5">
          <template #empty>
            <div class="flex justify-center">
              No hay velas por mostrar
            </div>
          </template>
          <template #list="slotProps">
            <div class="py-0 md:py-1 lg:py-2 xl:py-5 2xl:py-5">
              <div v-for="(candle, index) in slotProps.items" :key="index"
                   class="grid grid-cols-1 lg:grid-cols-10 gap-7 mx-2 lg:mx-5 xl:mx-5 2xl:mx-5 py-4 border-slate-300 dark:border-slate-500"
                   :class="{'border-b' : index < slotProps.items.length -1}"
              >
                <div class="col-span-1 lg:col-span-8 flex flex-col">
                  <span class="text-sm mt-4 mb-2 dark:text-white/70 text-surface-500">Tipo de vela</span>
                  <Dropdown
                      v-model="candle.candleType"
                      :options="candleListOptions"
                      optionLabel="name"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      placeholder="Seleccione un tipo de Vela"
                      class="w-full"
                      @change="onChangeCandleOption(index)"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex items-center gap-4">
                        <img :alt="slotProps.value.name"
                             :src="slotProps.value.urlImage"
                             class="w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] 2xl:w-[130px] h-[45px]"
                        />
                        <span class="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base">
                              {{ slotProps.value.name }}
                            </span>
                      </div>
                      <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex items-center gap-2">
                        <img :alt="slotProps.option.name"
                             :src="slotProps.option.urlImage"
                             class="w-[110px] h-[45px]"/>
                        <span class="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base">
                              {{ slotProps.option.name }}
                            </span>
                      </div>
                    </template>
                  </Dropdown>
                  <span class="text-sm mt-4 mb-2 dark:text-white/70 text-surface-500">Nombres</span>
                  <div class="flex justify-start">
                    <InputText type="text" v-model="candle.nameToAdd"
                               class="w-[85%] md:w-full lg:w-full xl:w-full 2xl:w-full"
                               @keyup.enter="addNameToList(index)"/>
                    <Button icon="pi pi-plus" rounded text raised @click="addNameToList(index)"/>
                  </div>
                  <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-1 mt-3">
                    <div v-for="candleInfo in candle.nameList" :key="candleInfo.idx"
                         class="rounded-lg p-2 bg-surface-200 dark:bg-surface-700 dark:text-surface-0/70 text-surface-700 relative">
                      <div>
                        <div class="flex flex-row items-center ">
                          <button class="justify-center rounded-lg bg-red-600 w-7 h-7 mr-1"
                                  @click="removeCandleName(index, candleInfo.idx)">
                            <i class="pi pi-times text-xs p-1 text-white"></i>
                          </button>
                          <span class="text-sm mr-3 text-wrap">{{ candleInfo.name }}</span>
                        </div>
                        <ButtonsDial :dialOptions="dialButtonsItems" info>
                          <template #item="dialSlotProps">
                            <Toast/>
                            <button
                                class="flex items-center justify-center rounded-lg cursor-pointer p-1 text-black"
                                :class="candleInfo[dialSlotProps.data.feature] ? 'bg-green-500' : 'bg-slate-100 dark:bg-slate-600'"
                                @click="changeSpecialFeature(dialSlotProps.data.feature, index, candleInfo.idx)"
                                v-tooltip.top="dialSlotProps.data.tooltip"
                            >
                              <i :class="dialSlotProps.data.icon"></i>
                            </button>
                          </template>
                        </ButtonsDial>
                      </div>
                    </div>
                  </div>
                  <span class="text-sm mt-4 mb-2 dark:text-white/70 text-surface-500">Observaciones</span>
                  <Textarea v-model="candle.observation" autoResize rows="1" cols="30"/>
                </div>
                <div class="col-span-1 lg:col-span-2 flex items-end justify-between gap-3 flex-col">
                  <div class="flex flex-col items-end">
                      <span class="font-bold text-base lg:text-lg xl:text-lg 2xl:text-lg">
                        {{ $h.formatCurrency(candle.price, 0) }}
                      </span>
                    <span class="font-bold text-base lg:text-lg xl:text-lg 2xl:text-lg">{{ candle.quantity }}</span>
                  </div>
                  <Button icon="pi pi-times" raised @click="removeCandle(index)"
                          v-tooltip="'Remover vela'"
                          label="Remover"
                          severity="danger"/>
                </div>
              </div>
            </div>
          </template>
        </DataView>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 mt-4">
          <span class="font-bold">Cant. Velas : <span class="font-normal">{{ totals.totalItems }}</span></span>
          <span class="font-bold">Cant. Nombres : <span class="font-normal">{{ totals.totalNames }}</span></span>
          <span class="font-bold">Precio Total : <span
              class="font-normal">{{ $h.formatCurrency(totals.totalPrice) }}</span></span>
        </div>

      </template>
    </Card>
    <div class="flex justify-center py-4">
      <Button icon="pi pi-check" raised @click="createOrder" label="Confirmar Pedido"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed, inject} from "vue";
import {useToast} from "primevue/usetoast";
import {useOrdersCreateStore} from "@/store/order/orders_create.store.js";
import {createCandleOrder, getCandleListOptions} from "@/services/orders/order.service.js"
import ButtonsDial from "@/components/general/ButtonsDial.vue";
import {
  createDetailsOrderDialButtonItems,
  createDetailOrderMessages,
  bulkPriceTypeName,
  retailPriceTypeName, warnTitleMessage, defaultObservationValue
} from "@/core/constants.js";
import {useDayJs} from "@/utils/useDayJs.js";
import {useRouter} from "vue-router";


const ordersCreateStore = useOrdersCreateStore()
const toast = useToast();
const router = useRouter()
const swal = inject('$swal')
const dayjs = useDayJs()

const candles = ref([])
const candleListOptions = ref([])
const minimumSizeBulkPrice = ref(0)
const priceTypeChanged = ref(false)
const dialButtonsItems = ref(createDetailsOrderDialButtonItems)

const customerInfo = computed(() => ordersCreateStore.getCustomerInfo)
const totals = computed(() => {
  return {
    totalItems: candles.value.filter(x => x.candleType !== undefined).length,
    totalNames: candles.value.reduce((acc, val) => acc + val.nameList.length, 0),
    totalPrice: candles.value.reduce((acc, val) => acc + val.price, 0)
  }
})

const addCandle = () => {
  candles.value.push({
    idx: candles.value.length + 1,
    candleType: undefined,
    nameToAdd: '',
    nameList: [],
    quantity: 0,
    price: 0,
    observation: ''
  })
}

const removeCandle = (candleIndex) => {
  candles.value.splice(candleIndex, 1)
  candles.value = candles.value.map((x, index) => {
    x.idx = index + 1
    return x
  })
  verifyChangePriceType()
}

const addNameToList = (index) => {
  const nameToAdd = candles.value[index].nameToAdd
  if (nameToAdd.length > 0) {
    candles.value[index].nameList.push(
        {
          idx: candles.value[index].nameList.length,
          name: nameToAdd,
          packAlone: false,
          deceased: false,
          pet: false,
        }
    )
    candles.value[index].nameToAdd = ''
    candles.value[index].quantity = candles.value[index].nameList.length
    candles.value[index].price = computePriceCandle(index)
  }
}

const removeCandleName = (candleIndex, NameIndex) => {
  candles.value[candleIndex].nameList = candles.value[candleIndex].nameList.filter(x => x.idx !== NameIndex)
      .map((x, index) => ({idx: index, name: x.name}))
  candles.value[candleIndex].quantity = candles.value[candleIndex].nameList.length
  candles.value[candleIndex].price = computePriceCandle(candleIndex)
}

const computePriceCandle = (candleIndex) => {
  const candleType = candles.value[candleIndex].candleType
  if (candleType === undefined) {
    return 0
  }

  const candleQuantity = candles.value[candleIndex].quantity
  const dozenPrice = customerInfo.value.priceType === bulkPriceTypeName ? candleType.bulkPrice : candleType.retailPrice
  const unitPrice = Math.floor(dozenPrice / 12)
  if (candleQuantity < 12) {
    return unitPrice * candleQuantity
  } else {
    const dozens = Math.floor(candleQuantity / 12)
    const units = candleQuantity - (dozens * 12)
    return (dozens * dozenPrice) + (units * unitPrice)
  }
}

const onChangeCandleOption = (candleIndex) => {
  const candleOption = candles.value[candleIndex].candleType
  if (candleOption.isPack) {
    candles.value[candleIndex].nameList = candleOption.packNames.map((value, index) => {
      return {
        idx: index,
        name: value,
        packAlone: false,
        deceased: false,
        pet: false,
      }
    })
    candles.value[candleIndex].quantity = candles.value[candleIndex].nameList.length
  }

  candles.value[candleIndex].price = computePriceCandle(candleIndex)
  verifyChangePriceType()
}

const changeSpecialFeature = (feature, candleIndex, NameIndex) => {
  const candle = candles.value[candleIndex]

  if (candle.candleType === undefined) {
    toast.add({
      severity: 'warn',
      summary: warnTitleMessage,
      detail: createDetailOrderMessages.noCandleSelected,
      life: 4000
    });
    return
  }

  const lowerCasePackNames = candle.candleType.packNames.map((name) => name.toLowerCase())

  switch (feature) {
    case 'packAlone':
      candles.value[candleIndex].nameList[NameIndex].packAlone = !candles.value[candleIndex].nameList[NameIndex].packAlone
      break
    case 'deceased':
      if (!candle.candleType.isPack && !lowerCasePackNames.includes(candle.nameList[NameIndex].name.toLowerCase())) {
        candles.value[candleIndex].nameList[NameIndex].deceased = !candles.value[candleIndex].nameList[NameIndex].deceased
      }
      break
    case 'pet':
      if (!candle.candleType.isPack && !lowerCasePackNames.includes(candle.nameList[NameIndex].name.toLowerCase())) {
        candles.value[candleIndex].nameList[NameIndex].pet = !candles.value[candleIndex].nameList[NameIndex].pet
      }
      break
  }
}

const verifyChangePriceType = () => {
  if (totals.value.totalItems >= minimumSizeBulkPrice.value && customerInfo.value.priceType === retailPriceTypeName) {
    ordersCreateStore.setPriceTypeCustomerInfo(bulkPriceTypeName)
    priceTypeChanged.value = true
    candles.value = candles.value.map((value, index) => {
      value.price = computePriceCandle(index)
      return value
    })
  }
  if (totals.value.totalItems < minimumSizeBulkPrice.value && priceTypeChanged.value) {
    ordersCreateStore.setPriceTypeCustomerInfo(retailPriceTypeName)
    priceTypeChanged.value = false
    candles.value = candles.value.map((value, index) => {
      value.price = computePriceCandle(index)
      return value
    })
  }
}

const clearList = () => candles.value = []

const createOrder = async () => {
  if (!candles.value.length) {
    swal({
      title: createDetailOrderMessages.createTitleError,
      icon: 'warning',
      text: createDetailOrderMessages.candleListEmpty
    })
    return
  }
  if (candles.value.some((value) => !value.nameList.length)) {
    swal({
      title: createDetailOrderMessages.createTitleError,
      icon: 'warning',
      text: createDetailOrderMessages.nameListEmpty
    })
    return
  }
  if (candles.value.some((value) => value.candleType === undefined)) {
    swal({
      title: createDetailOrderMessages.createTitleError,
      icon: 'warning',
      text: createDetailOrderMessages.candleNotSelected
    })
    return
  }
  const orderPayload = {
    customer: {
      email: customerInfo.value.email,
      name: customerInfo.value.name.toUpperCase(),
      phone_number: customerInfo.value.tel,
      price_type: customerInfo.value.priceType
    },
    candles: candles.value.map((candle) => ({
      candle_option_id: candle.candleType.id,
      name_list: candle.nameList.map((name) => {
        const {idx, ...nameInfo} = name
        return nameInfo
      }),
      price: candle.price,
      quantity: candle.quantity,
      observation: ['', null, undefined].includes(candle.observation) ? defaultObservationValue : candle.observation
    }))
  }
  console.log(orderPayload)
  const orderCreatedData = await createCandleOrder(orderPayload)
  if (orderCreatedData.status === 201) {
    const {data} = orderCreatedData
    const orderCode = data.orderCode ? data.orderCode : ''
    const orderRoute = router.resolve({name: 'view_order_by_code', params: {orderCode}}).href
    const successMessage = createDetailOrderMessages.detailSuccessCreate
        .replace('{ date }', dayjs(data.estimatedDelivered).format('DD [de] MMMM'))
        .replace('{ link }', `<a href="${orderRoute}" target="_blank" class="underline decoration-sky-500 text-sky-500">aquí</a>`)

    swal({
      title: data.message,
      icon: 'success',
      allowOutsideClick: false,
      html: successMessage
    }).then(() => {
      location.reload()
    })
  }
  console.log(orderCreatedData)
}

onMounted(async () => {
  await getCandleListOptions().then(({data}) => {
    minimumSizeBulkPrice.value = data.minimumSizeBulkPrice
    candleListOptions.value = data.candleListOptions
  })
})

defineExpose({
  clearList
})
</script>