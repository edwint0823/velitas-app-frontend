import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getConfigParamsList = async () => {
  return await axios.get(`${API_BACKEND_VELAS}/configuration/list`, {
    headers: {
      auth: true,
    },
  });
};

export const updateConfigParamValue = async (id, payload) => {
  return await axios.patch(`${API_BACKEND_VELAS}/configuration/update/${id}`, payload, {
    headers: {
      auth: true,
    },
  });
};
