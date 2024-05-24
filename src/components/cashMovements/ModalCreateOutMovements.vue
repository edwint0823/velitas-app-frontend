<template>
  <Dialog
    v-model:visible="modalOutMovementVisible"
    modal
    :header="`Registrar gasto`"
    :style="{ 'min-width': '30vw' }"
    :auto-z-index="false"
  >
    <div class="mb-2">
      <div class="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col">
          <label for="bank_entity_id">Banco</label>
          <Dropdown
            placeholder="Seleccione un banco"
            inputId="bank_entity_id"
            v-model="bankEntityId"
            :options="bankEntitiesList"
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
          <small class="text-red-600" :class="{ hidden: !errors.bankEntityId }">{{ errors.bankEntityId }}</small>
        </div>
        <div class="flex flex-col">
          <label for="amount">Valor: </label>
          <InputNumber
            v-model="amount"
            placeholder="valor"
            input-id="amount"
            mode="currency"
            currency="COP"
            locale="es-mx"
          />
          <small class="text-red-600" :class="{ hidden: !errors.amount }">{{ errors.amount }}</small>
        </div>
      </div>
      <div class="mb-2 flex flex-col">
        <label for="concept">Concepto: </label>
        <Textarea v-model="concept" placeholder="Concepto de gasto" />
        <small class="text-red-600" :class="{ hidden: !errors.concept }">{{ errors.concept }}</small>
      </div>
      <div class="flex items-center justify-center">
        <Button label="Guardar" icon="pi pi-save" @click="create" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { inject, ref } from "vue";
import * as yup from "yup";
import { createOutMovementMessages } from "@/core/constants.js";
import { useForm } from "vee-validate";
import { getBankEntitiesList } from "@/services/bankEntities/bankEntity.service.js";
import { createOutMovement } from "@/services/cashMovements/cashMovement.service.js";

const swal = inject("$swal");
const emit = defineEmits(["OutMovementCreated"]);
const modalOutMovementVisible = ref(false);

const schema = yup.object({
  bankEntityId: yup.number().default(null).required(createOutMovementMessages.requiredBank),
  amount: yup.number().default(null).required(createOutMovementMessages.requiredAmount),
  concept: yup.string().default("").required(createOutMovementMessages.requiredConcept),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [bankEntityId] = defineField("bankEntityId");
const [amount] = defineField("amount");
const [concept] = defineField("concept");

const bankEntitiesList = ref([]);

const getNameOfBankOption = (id, fileType = false) => {
  const bankSelected = bankEntitiesList.value.find((opt) => opt.id === id);
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

const create = handleSubmit(async (values) => {
  const payload = {
    bank_entity_id: values.bankEntityId,
    amount: values.amount,
    concept: values.concept,
  };
  await createOutMovement(payload).then(({ data }) => {
    swal({
      title: "Operación realizada con éxito",
      text: data.message,
      icon: "success",
      allowOutsideClick: false,
    }).then(() => {
      resetForm();
      modalOutMovementVisible.value = false;
      emit("OutMovementCreated");
    });
  });
});

const openModalCreateOutMovement = async () => {
  await getBankEntitiesList().then(({ data }) => {
    bankEntitiesList.value = data;
    modalOutMovementVisible.value = true;
  });
};

defineExpose({ openModalCreateOutMovement });
</script>
