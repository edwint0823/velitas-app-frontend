import axios from "axios";
import Swal from "sweetalert2";
import { errorMessages, HttpStatus } from "@/core/constants.js";
import { useAuthStore } from "@/store/auth/auth.store.js";

const authStore = useAuthStore();
axios.interceptors.request.use((request) => {
  document.getElementById("loading-component").classList.remove("hidden");
  return request;
});

axios.interceptors.response.use(
  (response) => {
    document.getElementById("loading-component").classList.add("hidden");
    return response;
  },
  (error) => {
    console.error("Error petición", error);
    document.getElementById("loading-component").classList.add("hidden");
    const { status } = error.response;
    if (status === HttpStatus.BAD_REQUEST) {
      Swal.fire({
        icon: "warning",
        title: errorMessages.validationFieldsError,
        text: `${error.response.data.detail.join("\n")}`,
      });
    } else if (status === HttpStatus.UNAUTHORIZED) {
      Swal.fire({
        icon: "warning",
        title: errorMessages.notAuthorizedError,
        text: error.response.data.error ? error.response.data.error : errorMessages.expiredSessionError,
      });
      authStore.logout();
    } else if (status === HttpStatus.FORBIDDEN) {
      Swal.fire({
        icon: "warning",
        title: errorMessages.accessDeniedError,
        text: errorMessages.accessDeniedDetailError,
      });
    } else if (status === HttpStatus.NOT_FOUND) {
      Swal.fire({
        icon: "warning",
        title: errorMessages.notFoundError,
        text: `No se encontró la ruta ${error.response.data.path}`,
      });
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Swal.fire({
        icon: "warning",
        title: errorMessages.internalServerError,
        text: error.response.data.message,
      });
    }
    return Promise.reject(error);
  },
);

export default axios;
