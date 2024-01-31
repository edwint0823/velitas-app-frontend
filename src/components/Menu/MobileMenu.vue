<template>
  <div>
    <MegaMenu :model="isLoggedIn ? items: []" class="w-full"/>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";

const isLoggedIn = computed(() => {
  // Todo: agregar storage para usuario loguedo
  return true
})
const items = ref([])
</script>

<style scoped>

</style>