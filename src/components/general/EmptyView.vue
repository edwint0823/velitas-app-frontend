<template>
  <div class="flex flex-col items-center">
    <img :src="imageUrl" alt="empty" :class="imageClass" />
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
  imageUrl: {
    type: String,
    required: false,
    default: "/images/empty.svg",
  },
  imageClass: {
    type: String,
    required: false,
    default: "w-1/2 md:w-1/5",
  },
});
</script>

<style scoped></style>
