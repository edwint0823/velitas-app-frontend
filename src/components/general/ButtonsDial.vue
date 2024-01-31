<template>
  <div data-dial-init class="absolute top-2 right-1 flex ">
    <div class="flex items-center me-2 gap-x-2 rtl:space-x-reverse bg-surface-400 dark:bg-slate-600 p-1 rounded-lg"
         :class="{'hidden': showDial}">
      <div v-for="(item, index) in dialOptions">
        <slot name="item" :data="item" :index="index"></slot>
        <button
            v-if="$slots.item === undefined"
            type="button"
            title="opción"
            class="flex justify-center items-center w-6 h-6 rounded-full shadow-sm text-slate-950 bg-white hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 "
            @click="item.command"
        >
          <span v-if="item.label">{{ item.label }}</span>
          <i :class="item.icon"></i>
        </button>
      </div>
    </div>
    <button type="button"
            title="mostrar opciones"
            class="flex items-center justify-center rounded-full w-7 h-7"
            :class="
              {
                'text-white bg-emerald-500 hover:bg-emerald-600 dark:text-black dark:bg-emerald-400 dark:hover:bg-emerald-300': usePrimary,
                'text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700': secondary,
                'text-white bg-green-500 hover:bg-green-600 dark:text-green-950 dark:bg-green-400 dark:hover:bg-green-300': success,
                'text-white bg-sky-500 hover:bg-sky-600 dark:text-sky-950 dark:bg-sky-400 dark:hover:bg-sky-300': info,
                'text-white bg-orange-500 hover:bg-orange-600 dark:text-orange-950 dark:bg-orange-400 dark:hover:bg-orange-300': warning,
                'text-white bg-purple-500 hover:bg-purple-600 dark:text-purple-950 dark:bg-purple-400 dark:hover:bg-purple-300': help,
                'text-white bg-red-500 hover:bg-red-600 dark:text-red-950 dark:bg-red-400 dark:hover:bg-red-300': danger,
                'text-white bg-slate-950 hover:bg-slate-800 dark:text-zinc-950 dark:bg-white dark:hover:bg-zinc-100': contrast,
              }
            "
            @click="showDial = !showDial"
    >
      <span :class="showDial ? iconOpen : iconClose"></span>
    </button>
  </div>
</template>
<script setup>
import {ref, computed} from "vue";

const props = defineProps(
    {
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
        default: 'pi pi-ellipsis-v'
      },
      iconClose: {
        type: String,
        default: 'pi pi-times'
      },
      dialOptions: {
        type: Array,
        default: [],
        validator(value, props) {
          return value.every(val => val.hasOwnProperty('icon'))
        }
      }
    }
)

const showDial = ref(true)

const usePrimary = computed(() => {
  return !(props.secondary || props.success || props.info || props.warning || props.help || props.danger || props.contrast);
})
</script>

<style scoped>

</style>