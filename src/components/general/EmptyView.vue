<template>
  <div class="flex flex-col items-center">
    <img src="/images/empty.svg" alt="empty" class="w-1/2 md:w-1/5" />
    <p class="text-center text-base font-bold md:text-xl">{{ message }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  message: {
    type: String,
    required: false,
    default: "No se encontraron elementos",
  },
});
</script>

<style scoped></style>
