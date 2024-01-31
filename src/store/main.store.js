import {defineStore} from 'pinia'

export const useMainStore = defineStore({
    id: 'mainStore',
    state: () => ({
        breadcrumbs: []
    }),
    getters: {
        getBreadcrumbs: (state) => state.breadcrumbs

    },
    actions: {
        setBreadcrumbs(breadcrumbs) {
            this.breadcrumbs = breadcrumbs
        }
    }
})