import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getCandleInventoryMovements = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_inventory_movements/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const getBagInventoryMovements = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/bag_inventory_movements/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const orderChangeStatusLogsList = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/order_status_change_logs/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};
