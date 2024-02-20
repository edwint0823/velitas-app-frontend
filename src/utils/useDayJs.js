import {getCurrentInstance} from "vue";

export function useDayJs() {
    const vm = getCurrentInstance()
    return vm.appContext.config.globalProperties.$dayjs
}