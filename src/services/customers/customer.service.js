import axios from "@/libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getDataClientByEmail = async (email) => {
  return await axios.get(`${API_BACKEND_VELAS}/customer/find/${email}`);
};

export const listCustomers = async (pageSize, pageNumber, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/customer/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const updateCustomer = async (email, payload) => {
  return await axios.patch(`${API_BACKEND_VELAS}/customer/update/${email}`, payload, {
    headers: {
      auth: true,
    },
  });
};

export const createCustomer = async (payload) => {
  return await axios.post(`${API_BACKEND_VELAS}/customer/create`, payload, {
    headers: {
      auth: true,
    },
  });
};
