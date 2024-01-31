import {defineStore} from 'pinia'

export const useOrdersCreateStore = defineStore({
    id: 'ordersCreateStore',
    state: () => ({
        clientInfo: {
            email: '',
            name: '',
            tel: '',
            priceType: ''
        }
    }),
    getters: {
        getClientInfo: (state) => state.clientInfo
    },
    actions: {
        setClientInfo(clientInfo) {
            this.clientInfo = clientInfo
        },
        setPriceTypeClientInfo(PriceType) {
            this.clientInfo.priceType = PriceType
        }
    }
})