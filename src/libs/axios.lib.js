import axios from "axios";
import Swal from "sweetalert2";
import { errorMessages, HttpStatus } from "@/core/constants.js";
import { useAuthStore } from "@/store/auth/auth.store.js";
import Cookies from "js-cookie";

const authStore = useAuthStore();
axios.interceptors.request.use((request) => {
  document.getElementById("loading-component").classList.remove("hidden");
  if (request.headers.auth) {
    const token = Cookies.get("token") ?? null;
    if (token !== null) {
      request.headers.authorization = `Baerer ${token}`;
    }
    delete request.headers.auth;
  }
  return request;
});

axios.interceptors.response.use(
  (response) => {
    document.getElementById("loading-component").classList.add("hidden");
    return response;
  },
  (error) => {
    document.getElementById("loading-component").classList.add("hidden");
    const { status } = error.response;
    if (status === HttpStatus.BAD_REQUEST) {
      let errorList = [];
      if (error.response.data.hasOwnProperty("detail")) {
        errorList = error.response.data.detail;
      } else {
        errorList.push(error.response.data.message);
        // for (let key in error.response.data) {
        //   if (Array.isArray(error.response.data[key])) {
        //     errorList.push(`${key}: ${error.response.data[key].join(", ")}`);
        //   } else {
        //     errorList.push(`${key}: ${error.response.data[key]}`);
        //   }
        // }
      }
      Swal.fire({
        icon: "warning",
        title: errorMessages.validationFieldsError,
        text: `${errorList.join("\n")}`,
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
