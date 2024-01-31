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
        <DataTable :value="candles">
          <template #empty>
            <div class="flex justify-center">
              No hay velas por mostrar
            </div>
          </template>
          <Column field="idx" header="No." bodyClass="text-center" headerClass="flex justify-center"/>
          <Column header="Tipo de vela">
            <template #body="slotProps">
              <Dropdown
                  v-model="slotProps.data.candleType"
                  :options="candleListOptions"
                  optionLabel="name"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  placeholder="Seleccione un tipo de Vela"
                  class="w-full md:w-full"
                  @change="onChangeCandleOption(slotProps.index)"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center gap-4">
                    <img :alt="slotProps.value.name"
                         :src="slotProps.value.urlImage"
                         style="width: 110px;height: 45px;"/>
                    <div>{{ slotProps.value.name }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img :alt="slotProps.option.name"
                         :src="slotProps.option.urlImage"
                         style="width: 110px;height: 45px;"/>
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Dropdown>
            </template>
          </Column>
          <Column header="Nombres" width="50px">
            <template #body="slotProps">
              <div class="flex justify-end">
                <InputText type="text" v-model="slotProps.data.nameToAdd" class="w-full"
                           @keyup.enter="addNameToList(slotProps)"/>
                <Button icon="pi pi-plus" rounded text raised @click="addNameToList(slotProps)"/>
              </div>
              <div class="flex flex-wrap max-w-[26rem] mt-3 gap-1">
                <div v-for="candleInfo in slotProps.data.nameList" :key="candleInfo.idx"
                     class="rounded-lg p-2 bg-surface-200 dark:bg-surface-700 dark:text-surface-0/70 text-surface-700 relative w-[43%]">
                  <div>
                    <div class="flex flex-row items-center ">
                      <button class="justify-center rounded-lg bg-red-600 w-7 h-7 mr-1"
                              @click="removeCandleName(slotProps.index, candleInfo.idx)">
                        <i class="pi pi-times text-xs p-1 text-white"></i>
                      </button>
                      <span class="text-sm mr-3 text-wrap">{{ candleInfo.name }}</span>
                    </div>
                    <ButtonsDial :dialOptions="dialButtonsItems" info>
                      <template #item="dialSlotProps">
                        <Toast/>
                        <button
                            class="flex items-center justify-center rounded-lg cursor-pointer p-1 text-black"
                            :class="candleInfo[dialSlotProps.data.feature] ? 'bg-green-500' : 'bg-slate-100 darK:bg-slate-600'"
                            @click="changeSpecialFeature(dialSlotProps.data.feature, slotProps.index, candleInfo.idx)"
                            v-tooltip.top="dialSlotProps.data.tooltip"
                        >
                          <i :class="dialSlotProps.data.icon"></i>
                        </button>
                      </template>
                    </ButtonsDial>
                  </div>

                </div>
              </div>

            </template>
          </Column>
          <Column field="quantity" header="Cantidad" body-class="text-center" header-class="flex justify-center"/>
          <Column header="Precio">
            <template #body="slotProps">
              <div>
                {{ $h.formatCurrency(slotProps.data.price, 0) }}
              </div>
            </template>
          </Column>
          <Column header="Observaciones">
            <template #body="slotProps">
              <div>
                <Textarea v-model="slotProps.data.observation" autoResize rows="2" cols="30"/>
              </div>
            </template>
          </Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <div>
                <Button icon="pi pi-times" text raised @click="removeCandle(slotProps.index)"
                        v-tooltip="'Eliminar vela'"
                        severity="danger"/>
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="flex gap-2 mt-4">
          <span class="font-bold">Cant. Velas : <span class="font-normal">{{ totals.totalItems }}</span></span>
          <span class="font-bold">Cant. Nombres : <span class="font-normal">{{ totals.totalNames }}</span></span>
          <span class="font-bold">Precio Total : <span
              class="font-normal">{{ $h.formatCurrency(totals.totalPrice) }}</span></span>
        </div>

      </template>
    </Card>
    <div class="flex justify-center mt-4">
      <Button icon="pi pi-check" raised @click="createOrder" label="Confirmar Pedido"/>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useOrdersCreateStore} from "@/store/order/orders_create.store.js";
import {getCandleListOptions} from "@/services/orders/createOrder.service.js"
import ButtonsDial from "@/components/general/ButtonsDial.vue";


const ordersCreateStore = useOrdersCreateStore()
const toast = useToast();

const candles = ref([])
const candleListOptions = ref([])
const minimumSizeBulkPrice = ref(0)
const priceTypeChanged = ref(false)
const dialButtonsItems = ref([
  {
    feature: 'packAlone',
    tooltip: 'Empacar solo',
    icon: 'pi pi-flag'
  },
  {
    feature: 'deceased',
    tooltip: 'Difunto',
    icon: 'pi pi-heart'
  },
  {
    feature: 'pet',
    tooltip: 'Mascota',
    icon: 'pi pi-twitter'
  }
])

const clientInfo = computed(() => ordersCreateStore.getClientInfo)
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

const addNameToList = ({index}) => {
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
  const dozenPrice = clientInfo.value.priceType === 'mayorista' ? candleType.bulkPrice : candleType.retailPrice
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
        name: value
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
      summary: 'Acción no permitida',
      detail: 'Seleccione una vela para poder realizar la acción',
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
  if (totals.value.totalItems >= minimumSizeBulkPrice.value && clientInfo.value.priceType === 'detal') {
    ordersCreateStore.setPriceTypeClientInfo('mayorista')
    priceTypeChanged.value = true
    candles.value = candles.value.map((value, index) => {
      value.price = computePriceCandle(index)
      return value
    })
  }
  if (totals.value.totalItems < minimumSizeBulkPrice.value && priceTypeChanged.value) {
    ordersCreateStore.setPriceTypeClientInfo('detal')
    priceTypeChanged.value = false
    candles.value = candles.value.map((value, index) => {
      value.price = computePriceCandle(index)
      return value
    })
  }
}

const clearList = () => candles.value = []

const createOrder = () => {
  console.log(clientInfo, candles.value.map((x) => {
    const {nameToAdd, ...rest} = x
    return rest
  }))
}

onMounted(async () => {
  await getCandleListOptions().then((data) => {
    minimumSizeBulkPrice.value = data.minimumSizeBulkPrice
    candleListOptions.value = data.candleListOptions
  })
})

defineExpose({
  clearList
})
</script>