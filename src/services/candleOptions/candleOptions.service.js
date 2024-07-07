import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getCandleOptionsPaginated = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_options/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const createCandleOption = async (formData) => {
  return await axios.post(`${API_BACKEND_VELAS}/candle_options/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      auth: true,
    },
  });
};

export const saveInfoCandleOption = async (id, formData) => {
  return await axios.patch(`${API_BACKEND_VELAS}/candle_options/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      auth: true,
    },
  });
};

export const findCandleOptionById = async (id) => {
  return await axios.get(`${API_BACKEND_VELAS}/candle_options/find/${id}`, {
    headers: {
      auth: true,
    },
  });
};
