import {defineStore} from 'pinia'

export const useOrdersCreateStore = defineStore({
    id: 'ordersCreateStore',
    state: () => ({
        customerInfo: {
            email: '',
            name: '',
            tel: '',
            priceType: ''
        }
    }),
    getters: {
        getCustomerInfo: (state) => state.customerInfo
    },
    actions: {
        setCustomerInfo(customerInfo) {
            this.customerInfo = customerInfo
        },
        setPriceTypeCustomerInfo(PriceType) {
            this.customerInfo.priceType = PriceType
        }
    }
})