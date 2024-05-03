import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const getBankEntitiesList = async () => {
  return await axios.get(`${API_BACKEND_VELAS}/bank_entity/list`, {
    headers: {
      auth: true,
    },
  });
};
