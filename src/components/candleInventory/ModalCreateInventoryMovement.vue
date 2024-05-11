<template>
  <Dialog
    v-model:visible="modalInventoryVisible"
    modal
    :header="`Registrar movimiento de inventario para ${candleInfo.name}`"
    :style="{ 'min-width': '30vw' }"
    :auto-z-index="false"
  >
    <div class="mb-2">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="quantity">Cantidad:</label>
          <InputNumber inputId="quantity" v-model="quantity" :min="0" />
          <small class="text-red-600" :class="{ hidden: !errors.quantity }">{{ errors.quantity }}</small>
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <span>Tipo de movimiento</span>
          <div class="flex items-center justify-center gap-4">
            <RadioButton v-model="movementType" inputId="entry" name="Ingreso" :value="true" />
            <label for="entry">Ingreso</label>
            <RadioButton v-model="movementType" inputId="out" name="Salida" :value="false" />
            <label for="out">Salida</label>
          </div>
          <small class="text-red-600" :class="{ hidden: !errors.movementType }">{{ errors.movementType }}</small>
        </div>
      </div>
      <div class="my-3 flex flex-col gap-2">
        <label for="observation">Observaciones:</label>
        <Textarea inputId="observation" v-model="observation" />
        <small class="text-red-600" :class="{ hidden: !errors.observation }">{{ errors.observation }}</small>
      </div>
      <div class="flex justify-center">
        <Button icon="pi pi-save" label="Guardar" @click="createInventoryMovement" />
      </div>
    </div>
  </Dialog>
</template>
<script setup>
import { inject, ref } from "vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { updateCandleInventoryQuantity } from "@/services/candlesInventory/candleInventory.service.js";
import { createCandleInventoryMovementMessages } from "@/core/constants.js";

const emit = defineEmits(["modalClosed"]);
const swal = inject("$swal");
const modalInventoryVisible = ref(false);
const candleInfo = ref({
  id: 0,
  name: "",
});

const schema = yup.object({
  quantity: yup.number().default(null).required(createCandleInventoryMovementMessages.requiredQuantity),
  movementType: yup.boolean().default(null).required(createCandleInventoryMovementMessages.requiredMovementType),
  observation: yup.string().default("").required(createCandleInventoryMovementMessages.requiredObservation),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [movementType] = defineField("movementType");
const [quantity] = defineField("quantity");
const [observation] = defineField("observation");

const openModal = (candle) => {
  candleInfo.value.id = candle.id;
  candleInfo.value.name = candle.name;
  modalInventoryVisible.value = true;
};

const createInventoryMovement = handleSubmit(async (values) => {
  const payload = {
    quantity: values.quantity,
    is_entry: values.movementType,
    observation: values.observation,
  };
  await updateCandleInventoryQuantity(candleInfo.value.id, payload).then(({ data }) => {
    swal({
      icon: "success",
      title: "Operación realizada con éxito",
      text: data.message,
      allowOutsideClick: false,
    }).then(() => {
      resetForm();
      modalInventoryVisible.value = false;
      emit("modalClosed");
    });
  });
});

defineExpose({ openModal });
</script>
