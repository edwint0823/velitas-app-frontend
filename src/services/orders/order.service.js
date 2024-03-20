import axios from '../../libs/axios.lib.js'

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS


export const getCandleListOptions = async () => {
    return await axios.get(`${API_BACKEND_VELAS}/candle_options/candle_options_with_min_items`)
}
export const createCandleOrder = async (orderPayload) => {
    return axios.post(`${API_BACKEND_VELAS}/order/create`, orderPayload)
}

export const getOrderByCode = async (code) => {
    return await axios.get(`${API_BACKEND_VELAS}/order/find_by_code/${code}`)
}