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
