<template>
  <div class="mb-6 flex justify-center">
    <span class="text-2xl font-bold md:text-3xl">Listado de parámetros de configuración</span>
  </div>
  <DataTable :value="configItems">
    <template #empty>
      <EmptyView message="No hay parámetros de configuración definidos" class="p-2" />
    </template>
    <Column header="Nombre del parámetro" field="param"></Column>
    <Column header="Valor del parámetro" field="value"></Column>
    <Column header="Acciones">
      <template #body="slotProps">
        <div class="flex justify-center">
          <Button
            icon="pi pi-pencil"
            severity="warning"
            v-tooltip="'Editar'"
            @click="openModalEditParam(slotProps.data)"
          ></Button>
        </div>
      </template>
    </Column>
  </DataTable>
  <ModalEditConfigParam @config-param-updated="getConfigParams" ref="modalEditConfigParamRef" />
</template>
<script setup>
import { useMainStore } from "@/store/main.store.js";
import { onMounted, ref } from "vue";
import EmptyView from "@/components/general/EmptyView.vue";
import { getConfigParamsList } from "@/services/configurationService/configuration.service.js";
import ModalEditConfigParam from "@/components/configPages/ModalEditConfigParam.vue";
import { breadCrumbsLabels } from "@/core/constants.js";

const mainStore = useMainStore();

const configItems = ref([]);
const modalEditConfigParamRef = ref();

const getConfigParams = async () => {
  await getConfigParamsList().then(({ data }) => {
    configItems.value = data;
  });
};
const openModalEditParam = (configParamInfo) => {
  modalEditConfigParamRef.value.openModalEdit(configParamInfo);
};

onMounted(async () => {
  mainStore.setBreadcrumbs([
    { label: breadCrumbsLabels.configuration.main },
    {
      label: breadCrumbsLabels.configuration.configParams,
      route: "list_config_params",
    },
  ]);
  await getConfigParams();
});
</script>

<style scoped></style>
