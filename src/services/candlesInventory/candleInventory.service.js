import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const listCandleInventory = async (payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_inventory/list`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const updateCandleInventoryQuantity = async (candleTypeId, payload) => {
  return await axios.patch(`${API_BACKEND_VELAS}/candle_inventory/update_quantity/${candleTypeId}`, payload, {
    headers: {
      auth: true,
    },
  });
};
