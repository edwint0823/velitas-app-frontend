import axios from "@/libs/axios.lib.js";

const API_AUTH_VELAS = import.meta.env.VITE_API_BACKEND_AUTH;

export const Login = async (payload) => {
  return await axios.post(`${API_AUTH_VELAS}/users/login/`, payload);
};
