import axios from "../../libs/axios.lib.js";
import Cookies from "js-cookie";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const statusListByOrder = (statusOrder) => {
  return axios.get(`${API_BACKEND_VELAS}/status/list_status/${statusOrder}`, {
    headers: {
      auth: true,
    },
  });
};
