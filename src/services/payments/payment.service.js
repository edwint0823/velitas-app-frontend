import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const addPaymentForOrder = async (paymentPayload) => {
  return await axios.post(`${API_BACKEND_VELAS}/payment/create`, paymentPayload, {
    headers: {
      auth: true,
    },
  });
};
