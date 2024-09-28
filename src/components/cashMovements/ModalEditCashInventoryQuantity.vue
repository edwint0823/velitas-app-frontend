<template>
  <Dialog
    v-model:visible="modalEditQuantityVisible"
    modal
    :header="`Modificar cantidad para ${inventoryItem.name}`"
    :style="{ 'min-width': '30vw' }"
    :auto-z-index="false"
  >
    <div class="mb-2">
      <div class="flex flex-col">
        <label for="quantity">Cantidad</label>
        <InputNumber v-model="quantity" placeholder="Cantidad" input-id="quantity" :min="0" />
        <small class="text-red-600" :class="{ hidden: !errors.quantity }">{{ errors.quantity }}</small>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <Button label="Guardar" icon="pi pi-save" @click="save" />
    </div>
  </Dialog>
</template>
<script setup>
import { inject, ref } from "vue";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { editCashInventoryItem, updateCashInventoryQuantity } from "@/services/cashMovements/cashMovement.service.js";
import { updateCashInventoryQuantityMessages } from "@/core/constants.js";

const swal = inject("$swal");
const emit = defineEmits(["quantityUpdated"]);

const modalEditQuantityVisible = ref(false);
const inventoryItem = ref({
  id: 0,
  name: "",
});
const schema = yup.object({
  quantity: yup.number().default(null).required(updateCashInventoryQuantityMessages.requiredQuantity).min(0),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [quantity] = defineField("quantity");

const openModal = async (id) => {
  await editCashInventoryItem(id).then(({ data }) => {
    inventoryItem.value.id = id;
    inventoryItem.value.name = data.name;
    quantity.value = data.quantity;
    modalEditQuantityVisible.value = true;
  });
};

const save = handleSubmit(async (values) => {
  const payload = {
    quantity: values.quantity,
  };
  await updateCashInventoryQuantity(inventoryItem.value.id, payload).then(({ data }) => {
    swal({
      title: "Operación realizada con éxito",
      text: data.message,
      icon: "success",
      allowOutsideClick: false,
    }).then(() => {
      resetForm();
      modalEditQuantityVisible.value = false;
      emit("quantityUpdated");
    });
  });
});

defineExpose({ openModal });
</script>

<style scoped></style>
