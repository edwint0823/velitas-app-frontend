import axios from "@/libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getProductionDetails = async () => {
  return await axios.get(`${API_BACKEND_VELAS}/dashboard/productionTotals`, {
    headers: {
      auth: true,
    },
  });
};
