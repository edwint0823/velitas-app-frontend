import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getCandleListOptions = async () => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_options/candle_options_with_min_items`);
};
