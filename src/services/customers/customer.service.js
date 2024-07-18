import axios from "@/libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getDataClientByEmail = async (email) => {
  return await axios.get(`${API_BACKEND_VELAS}/customer/find/${email}`);
};

export const listCustomers = async (pageSize, pageNumber) => {
  return await axios.get(`${API_BACKEND_VELAS}/customer/list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
  });
};
