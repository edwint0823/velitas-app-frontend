import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const paginateListMovements = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/cash_movements/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const createOutMovement = async (payload) => {
  return await axios.post(`${API_BACKEND_VELAS}/cash_movements/create_out_movement`, payload, {
    headers: {
      auth: true,
    },
  });
};

export const listCashInventory = async (payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/cash_inventory/list`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const editCashInventoryItem = async (id) => {
  return await axios.get(`${API_BACKEND_VELAS}/cash_inventory/find_item/${id}`, {
    headers: {
      auth: true,
    },
  });
};

export const updateCashInventoryQuantity = async (id, payload) => {
  return await axios.patch(`${API_BACKEND_VELAS}/cash_inventory/update_quantity/${id}`, payload, {
    headers: {
      auth: true,
    },
  });
};
