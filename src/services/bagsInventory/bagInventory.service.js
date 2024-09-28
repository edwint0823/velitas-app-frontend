import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const lisBagInventory = async (payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/bag_inventory/list`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const updateBagInventoryQuantity = async (bagId, payload) => {
  return await axios.patch(`${API_BACKEND_VELAS}/bag_inventory/update_quantity/${bagId}`, payload, {
    headers: {
      auth: true,
    },
  });
};
