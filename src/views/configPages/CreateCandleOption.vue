<template>
  <div class="flex justify-center">
    <span class="text-xl font-bold md:text-2xl">Crear nueva opción de vela</span>
  </div>
  <FormCandleOption @submit-form="saveNewCandleOption" />
</template>
<script setup>
import { inject, onMounted } from "vue";
import { breadCrumbsLabels } from "@/core/constants.js";
import { useMainStore } from "@/store/main.store.js";
import FormCandleOption from "@/components/configPages/FormCandleOption.vue";
import { createCandleOption } from "@/services/candleOptions/candleOptions.service.js";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const router = useRouter();
const swal = inject("$swal");

const saveNewCandleOption = async (values) => {
  const formData = new FormData();
  formData.append("file", values.imageFile);
  formData.append("name", values.name);
  formData.append("bulk_price", values.bulk_price);
  formData.append("retail_price", values.retail_price);
  formData.append("is_pack", values.is_pack);
  formData.append("candle_type_id", values.candle_type_id);
  formData.append("is_vip_pack", values.is_vip_pack);
  formData.append("pack_names", values.pack_names.join(","));
  await createCandleOption(formData).then(({ data }) => {
    swal({
      icon: "success",
      title: "Operación realizada con éxito",
      text: data.message,
      allowOutsideClick: false,
    }).then(() => {
      router.push({ name: "list_candle_options" });
    });
  });
};

onMounted(() => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.configuration.main },
    { label: breadCrumbsLabels.configuration.createCandleOption, route: "create_candle_option" },
  ]);
});
</script>
<style scoped></style>
