<template>
  <div class="flex justify-center">
    <span class="text-xl font-bold md:text-2xl">Editar opción de vela</span>
  </div>
  <FormCandleOption @submit-form="updateCandleOption" :is-edit="true" />
</template>
<script setup>
import FormCandleOption from "@/components/configPages/FormCandleOption.vue";
import { inject, onMounted } from "vue";
import { breadCrumbsLabels } from "@/core/constants.js";
import { useMainStore } from "@/store/main.store.js";
import { useRoute, useRouter } from "vue-router";
import { saveInfoCandleOption } from "@/services/candleOptions/candleOptions.service.js";

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
const swal = inject("$swal");

const updateCandleOption = async (values) => {
  const formData = new FormData();
  if (typeof values.imageFile === "object") {
    formData.append("file", values.imageFile);
  }
  formData.append("name", values.name);
  formData.append("bulk_price", values.bulk_price);
  formData.append("retail_price", values.retail_price);
  formData.append("is_pack", values.is_pack);
  formData.append("candle_type_id", values.candle_type_id);
  formData.append("is_vip_pack", values.is_vip_pack);
  formData.append("is_visible", values.visible);
  formData.append("pack_names", values.pack_names.join(","));
  await saveInfoCandleOption(route.params.id, formData).then(({ data }) => {
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
    { label: breadCrumbsLabels.configuration.editCandleOption, route: "edit_candle_option" },
  ]);
});
</script>

<style scoped></style>
