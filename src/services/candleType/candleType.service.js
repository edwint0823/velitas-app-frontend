import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const listCandleTypes = async () => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_type/list`, {
    headers: {
      auth: true,
    },
  });
};
