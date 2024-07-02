<template>
  <Dialog
    v-model:visible="modalEditConfigParamVisible"
    modal
    :header="`Editar parámetro ${configParamInfo.param}`"
    :style="{ 'min-width': '30vw' }"
    :auto-z-index="false"
  >
    <div class="mb-4">
      <div class="flex flex-col">
        <label for="config_param_value">Valor del parámetro: </label>
        <InputText id="config_param_value" v-model="configValue" type="text" class="w-full" />
        <small class="text-red-600" :class="{ hidden: !errors.configValue }">{{ errors.configValue }}</small>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <Button label="Actualizar" icon="pi pi-save" @click="updateConfigParam" />
    </div>
  </Dialog>
</template>
<script setup>
import { inject, ref } from "vue";
import * as yup from "yup";
import { editConfigParamMessages } from "@/core/constants.js";
import { useForm } from "vee-validate";
import { updateConfigParamValue } from "@/services/configurationService/configuration.service.js";

const swal = inject("$swal");
const emit = defineEmits(["configParamUpdated"]);
const modalEditConfigParamVisible = ref(false);
const schema = yup.object({
  configValue: yup.string().default(null).required(editConfigParamMessages.requiredConfigParamValue),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [configValue] = defineField("configValue");
const configParamInfo = ref({
  id: 0,
  param: "",
});

const openModalEdit = (configParam) => {
  configValue.value = configParam.value;
  configParamInfo.value.id = configParam.id;
  configParamInfo.value.param = configParam.param;

  modalEditConfigParamVisible.value = true;
};

const updateConfigParam = handleSubmit(async (values) => {
  const payload = {
    value: values.configValue,
  };
  await updateConfigParamValue(configParamInfo.value.id, payload).then(({ data }) => {
    swal({
      title: "Operación realizada con éxito",
      text: data.message,
      icon: "success",
      allowOutsideClick: false,
    }).then(() => {
      resetForm();
      modalEditConfigParamVisible.value = false;
      emit("configParamUpdated");
    });
  });
});
defineExpose({
  openModalEdit,
});
</script>

<style scoped></style>
