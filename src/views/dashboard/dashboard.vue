<template>
  <div>
    <h1>Dasboard</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { breadCrumbsLabels } from "@/core/constants.js";

const mainStore = useMainStore();
onMounted(() => {
  mainStore.setBreadcrumbs([{ label: breadCrumbsLabels.dashboard.main, route: "dashboard" }]);
});
</script>
