<template>
  <div data-dial-init class="absolute right-1 top-2 flex">
    <div
      class="me-2 flex items-center gap-x-2 rounded-lg bg-surface-400 p-1 rtl:space-x-reverse dark:bg-slate-600"
      :class="{ hidden: showDial }"
    >
      <div v-for="(item, index) in dialOptions">
        <slot name="item" :data="item" :index="index"></slot>
        <button
          v-if="$slots.item === undefined"
          type="button"
          title="opción"
          class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          @click="item.command"
        >
          <span v-if="item.label">{{ item.label }}</span>
          <i :class="item.icon"></i>
        </button>
      </div>
    </div>
    <button
      type="button"
      title="mostrar opciones"
      class="flex h-7 w-7 items-center justify-center rounded-full"
      :class="{
        'bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-400 dark:text-black dark:hover:bg-emerald-300':
          usePrimary,
        'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700':
          secondary,
        'bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-300':
          success,
        'bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-400 dark:text-sky-950 dark:hover:bg-sky-300': info,
        'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-400 dark:text-orange-950 dark:hover:bg-orange-300':
          warning,
        'bg-purple-500 text-white hover:bg-purple-600 dark:bg-purple-400 dark:text-purple-950 dark:hover:bg-purple-300':
          help,
        'bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:text-red-950 dark:hover:bg-red-300': danger,
        'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100': contrast,
      }"
      @click="showDial = !showDial"
    >
      <span :class="showDial ? iconOpen : iconClose"></span>
    </button>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  secondary: {
    type: Boolean,
    default: false,
  },
  success: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Boolean,
    default: false,
  },
  warning: {
    type: Boolean,
    default: false,
  },
  help: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  contrast: {
    type: Boolean,
    default: false,
  },
  iconOpen: {
    type: String,
    default: "pi pi-ellipsis-v",
  },
  iconClose: {
    type: String,
    default: "pi pi-times",
  },
  dialOptions: {
    type: Array,
    default: [],
    validator(value, props) {
      return value.every((val) => val.hasOwnProperty("icon"));
    },
  },
});

const showDial = ref(true);

const usePrimary = computed(() => {
  return !(
    props.secondary ||
    props.success ||
    props.info ||
    props.warning ||
    props.help ||
    props.danger ||
    props.contrast
  );
});
</script>

<style scoped></style>
