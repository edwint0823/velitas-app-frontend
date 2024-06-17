<template>
  <Card class="mb-5">
    <template #title>Información general</template>
    <template #content>
      <div class="grid grid-cols-1 gap-x-16 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        <div class="flex flex-col gap-2">
          <span>Cliente:</span>
          <span>{{ order.customerName }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span>Tipo de cliente:</span>
          <span>{{ order.customerPriceType.toUpperCase() }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <label for="delivery_address">Dirección de entrega:</label>
          <InputText type="text" placeholder="Dirección de entrega" v-model="delivery_address" />
          <small class="text-red-600" :class="{ hidden: !errors.delivery_address }">{{
            errors.delivery_address
          }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="delivery_price">Precio de entrega:</label>
          <InputText type="text" placeholder="Precio de la entrega" v-model="delivery_price" />
          <small class="text-red-600" :class="{ hidden: !errors.delivery_price }">{{ errors.delivery_price }}</small>
        </div>
        <div class="flex flex-col gap-2">
          <label for="additional_info"
            ><i
              class="pi pi-info"
              v-tooltip.top="
                'Puede agregar información como el nombre la persona que recoge , numero de cédula para envío por interrapidisimo'
              "
            ></i
            >Información adicional:</label
          >
          <InputText type="text" placeholder="Información adicional" v-model="additional_info" />
          <small class="text-red-600" :class="{ hidden: !errors.additional_info }">{{ errors.additional_info }}</small>
        </div>
      </div>
    </template>
  </Card>
  <div class="sticky top-0 z-10 rounded-2xl bg-white/90">
    <div class="flex justify-between px-6 py-4">
      <span class="text-900 text-xl font-bold">Listado de velas</span>
      <Button icon="pi pi-plus" rounded raised @click="addCandle" v-tooltip="'Agregar vela'" />
    </div>
  </div>
  <Card>
    <template #content>
      <DataView :value="order.details" layout="list" class="mb-5">
        <template #empty>
          <div class="flex justify-center">No hay velas por mostrar</div>
        </template>
        <template #list="slotProps">
          <div class="py-0 md:py-1 lg:py-2 xl:py-5 2xl:py-5">
            <div
              v-for="(candle, index) in slotProps.items"
              :key="index"
              class="mx-2 grid grid-cols-1 gap-7 border-slate-300 py-4 lg:mx-5 lg:grid-cols-10 xl:mx-5 2xl:mx-5 dark:border-slate-500"
              :class="{ 'border-b': index < slotProps.items.length - 1 }"
            >
              <div class="col-span-1 flex flex-col lg:col-span-8">
                <span class="mb-2 mt-4 text-sm text-surface-500 dark:text-white/70"> Tipo de vela </span>
                <Dropdown
                  v-model="candle.candleOptionId"
                  :options="candleOptions"
                  optionLabel="name"
                  optionValue="id"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  placeholder="Seleccione un tipo de Vela"
                  class="w-full"
                  @change="onChangeCandleOption(index)"
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center gap-4">
                      <img
                        :alt="findCandleSelected(slotProps.value, 'name')"
                        :src="findCandleSelected(slotProps.value, 'urlImage')"
                        class="h-[45px] w-[90px] md:w-[100px] lg:w-[110px] xl:w-[120px] 2xl:w-[130px]"
                      />
                      <span class="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base">
                        {{ findCandleSelected(slotProps.value, "name") }}
                      </span>
                    </div>
                    <span v-else>{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center gap-2">
                      <img :alt="slotProps.option.name" :src="slotProps.option.urlImage" class="h-[45px] w-[110px]" />
                      <span class="text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base">
                        {{ slotProps.option.name }}
                      </span>
                    </div>
                  </template>
                </Dropdown>
                <span class="mb-2 mt-4 text-sm text-surface-500 dark:text-white/70"> Nombres </span>
                <Toast />
                <div class="flex justify-start">
                  <InputText
                    type="text"
                    v-model="candle.nameToAdd"
                    class="w-[85%] md:w-full lg:w-full xl:w-full 2xl:w-full"
                    @keyup.enter="addNameToList(index)"
                  />
                  <Button icon="pi pi-plus" rounded text raised @click="addNameToList(index)" />
                </div>
                <div class="mt-3 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
                  <div
                    v-for="candleInfo in candle.nameList"
                    :key="candleInfo.idx"
                    class="relative rounded-lg bg-surface-200 p-2 text-surface-700 dark:bg-surface-700 dark:text-surface-0/70"
                  >
                    <div>
                      <div class="flex flex-row items-center">
                        <button
                          class="mr-1 h-7 w-7 justify-center rounded-lg bg-red-600"
                          @click="removeCandleName(index, candleInfo.idx)"
                        >
                          <i class="pi pi-times p-1 text-xs text-white"></i>
                        </button>
                        <span class="mr-3 text-wrap text-sm">
                          {{ candleInfo.name }}
                        </span>
                      </div>
                      <ButtonsDial :dialOptions="dialButtonsItems" info>
                        <template #item="dialSlotProps">
                          <Toast />
                          <button
                            class="flex cursor-pointer items-center justify-center rounded-lg p-1 text-black"
                            :class="
                              candleInfo[dialSlotProps.data.feature] ? 'bg-green-500' : 'bg-slate-100 dark:bg-slate-600'
                            "
                            @click="changeSpecialFeature(dialSlotProps.data.feature, index, candleInfo.idx)"
                            v-tooltip.top="dialSlotProps.data.tooltip"
                          >
                            <img :src="dialSlotProps.data.icon" :alt="dialSlotProps.data.tooltip" />
                          </button>
                        </template>
                      </ButtonsDial>
                    </div>
                  </div>
                </div>
                <span class="mb-2 mt-4 text-sm text-surface-500 dark:text-white/70"> Observaciones </span>
                <Textarea v-model="candle.observation" autoResize rows="1" cols="30" />
              </div>
              <div class="col-span-1 flex flex-col items-end justify-between gap-3 lg:col-span-2">
                <div class="flex flex-col items-end">
                  <span class="text-base font-bold lg:text-lg xl:text-lg 2xl:text-lg">
                    {{ $h.formatCurrency(candle.price, 0) }}
                  </span>
                  <span class="text-base font-bold lg:text-lg xl:text-lg 2xl:text-lg">
                    {{ candle.quantity }}
                  </span>
                </div>
                <Button
                  v-if="!candle.id"
                  icon="pi pi-times"
                  raised
                  @click="removeCandle(index)"
                  v-tooltip="'Remover vela'"
                  label="Remover"
                  severity="danger"
                />
              </div>
            </div>
          </div>
        </template>
      </DataView>
      <div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        <span class="font-bold">
          Cant. Velas :
          <span class="font-normal">{{ totals.totalItems }}</span>
        </span>
        <span class="font-bold">
          Cant. Nombres :
          <span class="font-normal">{{ totals.totalNames }}</span>
        </span>
        <span class="font-bold">
          Precio Total :
          <span class="font-normal">
            {{ $h.formatCurrency(totals.totalPrice) }}
          </span>
        </span>
      </div>
    </template>
  </Card>
  <div class="flex justify-center py-4">
    <Button icon="pi pi-save" raised @click="updateOrder" label="Actualizar Pedido" />
  </div>
</template>
<script setup>
import { computed, inject, onMounted, ref } from "vue";
import {
  baseStructureForEditOrderByCode,
  breadCrumbsLabels,
  bulkPriceTypeName,
  createOrEditDetailsOrderDialButtonItems,
  editOrderMessages,
  editOrderValidation,
  retailPriceTypeName,
  warnTitleMessage,
} from "@/core/constants.js";
import { useMainStore } from "@/store/main.store.js";
import { useRoute, useRouter } from "vue-router";
import { editOrderByCode, updateOrderAndDetails } from "@/services/orders/order.service.js";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { getCandleListOptions } from "@/services/candleType/candleType.service.js";
import ButtonsDial from "@/components/general/ButtonsDial.vue";
import { useToast } from "primevue/usetoast";

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const swal = inject("$swal");

const totals = computed(() => {
  return {
    totalItems: order.value.details.filter((x) => x.candleOptionId !== undefined).length,
    totalNames: order.value.details.reduce((acc, val) => acc + val.nameList.length, 0),
    totalPrice: order.value.details.reduce((acc, val) => acc + val.price, 0),
  };
});

const order = ref(baseStructureForEditOrderByCode);
const dialButtonsItems = ref(createOrEditDetailsOrderDialButtonItems);
const candleOptions = ref([]);
const minimumSizeBulkPrice = ref(0);
const priceTypeChanged = ref(false);

const schema = yup.object({
  delivery_address: yup
    .string()
    .default("")
    .required(editOrderValidation.requiredDeliveryAddress)
    .max(255, "La dirección no puede tener mas de "),
  delivery_price: yup.number().default(0),
  additional_info: yup.string().default(""),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [delivery_address] = defineField("delivery_address");
const [additional_info] = defineField("additional_info");
const [delivery_price] = defineField("delivery_price");

const findCandleSelected = (id, nameParam = null) => {
  const candleSelected = candleOptions.value
    .map((candle) => {
      let item = candle.items.find((item) => item.id === id);
      if (item) {
        return {
          label: candle.label,
          item: item,
        };
      }
    })
    .find(Boolean);
  if (nameParam !== null) return candleSelected.item[nameParam];
  return candleSelected;
};

const getOrderInfo = async () => {
  return await editOrderByCode(route.params.code).then(({ data }) => {
    const { deliveryAddress, deliveryPrice, additionalInfo, ...orderInfo } = data;
    order.value = orderInfo;
    delivery_address.value = deliveryAddress;
    delivery_price.value = deliveryPrice;
    additional_info.value = additionalInfo;
    verifyChangePriceType();
  });
};

const addCandle = () => {
  order.value.details.push({
    candleOptionId: undefined,
    nameList: [],
    price: 0,
    quantity: 0,
    observation: "",
    nameToAdd: "",
  });
};

const removeCandle = (candleIndex) => {
  order.value.details.splice(candleIndex, 1);
  verifyChangePriceType();
};

const addNameToList = (index) => {
  const idCandleSelected = order.value.details[index].candleOptionId;
  if (idCandleSelected === undefined) {
    toast.add({
      severity: "warn",
      summary: warnTitleMessage,
      detail: editOrderMessages.noCandleSelected,
      life: 4000,
    });
    return;
  }

  const infoCandleSelected = findCandleSelected(idCandleSelected);
  if (infoCandleSelected.item.isVipPack) {
    toast.add({
      severity: "warn",
      summary: warnTitleMessage,
      detail: editOrderMessages.candleIsVipPack,
      life: 4000,
    });
    return;
  }

  const nameToAdd = order.value.details[index].nameToAdd;
  if (nameToAdd.length > 0) {
    order.value.details[index].nameList.push({
      idx: order.value.details[index].nameList.length,
      name: nameToAdd
        .split(" ")
        .map((p) => {
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        })
        .join(" "),
      packAlone: false,
      deceased: false,
      pet: false,
    });
    order.value.details[index].nameToAdd = "";
    order.value.details[index].quantity = order.value.details[index].nameList.length;
    order.value.details[index].price = computePriceCandle(index);
  }
};

const removeCandleName = (candleIndex, NameIndex) => {
  order.value.details[candleIndex].nameList = order.value.details[candleIndex].nameList
    .filter((item) => item.idx !== NameIndex)
    .map((item, index) => ({
      idx: index,
      name: item.name,
      pet: item.pet,
      deceased: item.deceased,
      packAlone: item.packAlone,
    }));
  order.value.details[candleIndex].quantity = order.value.details[candleIndex].nameList.length;
  order.value.details[candleIndex].price = computePriceCandle(candleIndex);
};

const changeSpecialFeature = (feature, candleIndex, NameIndex) => {
  const candle = order.value.details[candleIndex];
  const infoCandleSelected = findCandleSelected(candle.candleOptionId);

  const packNamesOfCandleSelected = infoCandleSelected.item.packNames.map((name) => name.toLowerCase());

  switch (feature) {
    case "packAlone":
      order.value.details[candleIndex].nameList[NameIndex].packAlone =
        !order.value.details[candleIndex].nameList[NameIndex].packAlone;
      break;
    case "deceased":
      if (
        !infoCandleSelected.item.isPack ||
        !packNamesOfCandleSelected.includes(candle.nameList[NameIndex].name.toLowerCase())
      ) {
        order.value.details[candleIndex].nameList[NameIndex].deceased =
          !order.value.details[candleIndex].nameList[NameIndex].deceased;
      }
      break;
    case "pet":
      if (
        !infoCandleSelected.item.isPack ||
        !packNamesOfCandleSelected.includes(candle.nameList[NameIndex].name.toLowerCase())
      ) {
        order.value.details[candleIndex].nameList[NameIndex].pet =
          !order.value.details[candleIndex].nameList[NameIndex].pet;
      }
      break;
  }
};

const onChangeCandleOption = (candleIndex) => {
  const candleOptionSelected = findCandleSelected(order.value.details[candleIndex].candleOptionId);
  if (candleOptionSelected.item.isPack) {
    order.value.details[candleIndex].nameList = candleOptionSelected.item.packNames.map((value, index) => {
      return {
        idx: index,
        name: value,
        packAlone: false,
        deceased: false,
        pet: false,
      };
    });
    order.value.details[candleIndex].quantity = order.value.details[candleIndex].nameList.length;
  }

  order.value.details[candleIndex].price = computePriceCandle(candleIndex);
  verifyChangePriceType();
};

const verifyChangePriceType = () => {
  let priceTypeUpdated = false;
  if (totals.value.totalItems >= minimumSizeBulkPrice.value && order.value.customerPriceType === retailPriceTypeName) {
    order.value.customerPriceType = bulkPriceTypeName;
    priceTypeChanged.value = true;
    priceTypeUpdated = true;
  }
  if (totals.value.totalItems < minimumSizeBulkPrice.value && priceTypeChanged.value) {
    order.value.customerPriceType = retailPriceTypeName;
    priceTypeChanged.value = false;
    priceTypeUpdated = true;
  }
  if (priceTypeUpdated) {
    order.value.details = order.value.details.map((detail, index) => {
      detail.price = computePriceCandle(index);
      return detail;
    });
  }
};

const computePriceCandle = (candleIndex) => {
  const idCandleSelected = order.value.details[candleIndex].candleOptionId;
  if (idCandleSelected === undefined) {
    return 0;
  }
  const infoCandleSelected = findCandleSelected(idCandleSelected);
  const candleQuantity = order.value.details[candleIndex].quantity;
  const dozenPrice =
    order.value.customerPriceType === bulkPriceTypeName
      ? infoCandleSelected.item.bulkPrice
      : infoCandleSelected.item.retailPrice;
  const unitPrice = Math.floor(dozenPrice / 12);
  if (candleQuantity < 12) {
    return unitPrice * candleQuantity;
  } else {
    const dozens = Math.floor(candleQuantity / 12);
    const units = candleQuantity - dozens * 12;
    return dozens * dozenPrice + units * unitPrice;
  }
};

const updateOrder = handleSubmit(async (values) => {
  if (!order.value.details.length) {
    swal({
      title: editOrderMessages.updateTitleError,
      icon: "warning",
      text: editOrderMessages.candleListEmpty,
    });
    return;
  }
  if (order.value.details.some((detail) => !detail.nameList.length)) {
    swal({
      title: editOrderMessages.updateTitleError,
      icon: "warning",
      text: editOrderMessages.nameListEmpty,
    });
    return;
  }
  if (order.value.details.some((detail) => detail.candleOptionId === undefined)) {
    swal({
      title: editOrderMessages.updateTitleError,
      icon: "warning",
      text: editOrderMessages.candleNotSelected,
    });
    return;
  }
  const orderPayload = {
    delivery_address: values.delivery_address,
    additional_info: values.additional_info !== "" ? values.additional_info : undefined,
    delivery_price: Number(values.delivery_price),
    candles: order.value.details.map((detail) => {
      return {
        candle_option_id: detail.candleOptionId,
        candle_type_id: findCandleSelected(detail.candleOptionId, "candleTypeId"),
        name_list: detail.nameList.map((item) => {
          const { idx, ...nameInfo } = item;
          return nameInfo;
        }),
        price: detail.price,
        quantity: detail.quantity,
        observation: detail.observation,
      };
    }),
  };
  await updateOrderAndDetails(route.params.code, orderPayload).then(({ data }) => {
    swal({
      title: data.message,
      icon: "success",
      allowOutsideClick: false,
      text: `El pedido Nro ${route.params.code} ha sido actualizado con éxito`,
    }).then(() => {
      router.push({ name: "list_orders" });
    });
  });
});

onMounted(async () => {
  await getCandleListOptions().then(({ data }) => {
    candleOptions.value = data.candleListOptions;
    minimumSizeBulkPrice.value = data.minimumSizeBulkPrice;
  });
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.order.main },
    {
      label: breadCrumbsLabels.order.editOrder,
      route: "edit_order",
    },
  ]);
  await getOrderInfo();
});
</script>
