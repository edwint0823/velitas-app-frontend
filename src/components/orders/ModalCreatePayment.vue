<template>
  <Dialog
    v-model:visible="modalPaymentVisible"
    modal
    :header="`Registrar pago al pedido Nro ${orderCode}`"
    :style="{ 'min-width': '45vw' }"
    :auto-z-index="false"
  >
    <div class="mb-4">
      <div class="flex flex-col gap-2">
        <label for="bank_entity">Banco: </label>
        <Dropdown
          id="bank_entity"
          placeholder="Seleccione un banco"
          v-model="bank_entity_id"
          :options="bankEntityList"
          option-label="name"
          option-value="id"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="align-items-center flex">
              <img
                :alt="getNameOfBankOption(slotProps.value, true)"
                :src="`/icons/${getNameOfBankOption(slotProps.value, true)}.webp`"
                class="mr-2 w-[18px]"
              />
              <div>{{ getNameOfBankOption(slotProps.value) }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="align-items-center flex">
              <img
                :alt="getNameOfBankOption(slotProps.option.id, true)"
                :src="`/icons/${getNameOfBankOption(slotProps.option.id, true)}.webp`"
                class="mr-2 w-[18px]"
              />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Dropdown>
        <small class="text-red-600" :class="{ hidden: !errors.bank_entity_id }">{{ errors.bank_entity_id }}</small>
      </div>
      <div class="mt-3 flex flex-col gap-2">
        <label for="amount">Cantidad: </label>
        <InputNumber
          inputId="amount"
          v-model="amount"
          currency="COP"
          locale="es-co"
          :min="0"
          prefix="COP "
          placeholder="Valor del pago"
        />
        <small class="text-red-600" :class="{ hidden: !errors.amount }">{{ errors.amount }}</small>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <Button label="Registrar" icon="pi pi-money-bill" @click="addPaymentToOrder" />
    </div>
  </Dialog>
</template>
<script setup>
import { inject, ref } from "vue";
import { getBankEntitiesList } from "@/services/bankEntities/bankEntity.service.js";
import * as yup from "yup";
import { editOrderValidation } from "@/core/constants.js";
import { useForm } from "vee-validate";
import { addPaymentForOrder } from "@/services/payments/payment.service.js";

const emit = defineEmits(["paymentRegistered"]);
const swal = inject("$swal");

const modalPaymentVisible = ref(false);
const orderCode = ref("");
const bankEntityList = ref([]);

const schema = yup.object({
  bank_entity_id: yup.number().default(undefined).required(editOrderValidation.requiredDeliveryAddress),
  amount: yup.number().default(0),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [bank_entity_id] = defineField("bank_entity_id");
const [amount] = defineField("amount");

const getNameOfBankOption = (id, fileType = false) => {
  const bankSelected = bankEntityList.value.find((opt) => opt.id === id);
  if (!bankSelected) return "";
  if (fileType) {
    return bankSelected.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
  }

  return bankSelected.name;
};

const openPaymentModal = async (code) => {
  orderCode.value = code;
  await getBankEntitiesList().then(({ data }) => {
    bankEntityList.value = data;
  });

  modalPaymentVisible.value = true;
};

const addPaymentToOrder = handleSubmit(async (values) => {
  const payload = {
    order_code: orderCode.value,
    amount: Number(values.amount),
    bank_entity_id: Number(values.bank_entity_id),
  };
  await addPaymentForOrder(payload).then(({ data }) => {
    swal({
      title: "Registro exitoso",
      icon: "success",
      text: data.message,
    }).then(() => {
      resetForm();
      emit("paymentRegistered");
      modalPaymentVisible.value = false;
    });
  });
});

defineExpose({ openPaymentModal });
</script>
