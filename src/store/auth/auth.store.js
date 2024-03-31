import { defineStore } from "pinia";
import Cookies from "js-cookie";
import router from "../../router/index.js";

export const useAuthStore = defineStore({
  id: "authStore",
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    getUserInfo: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => {
      if (state.token === null && Cookies.get("token") !== undefined) {
        state.setToken(Cookies.get("token"));
      }
      if (state.user === null && Cookies.get("user") !== undefined) {
        state.setUserInfo(JSON.parse(Cookies.get("user")));
      }
      return state.token !== null;
    },
  },
  actions: {
    setUserInfo(userInfo) {
      this.user = userInfo;
      Cookies.set("user", JSON.stringify(userInfo));
    },
    setToken(token) {
      this.token = token;
      Cookies.set("token", token);
    },
    logout() {
      this.token = null;
      this.user = null;
      Cookies.remove("user");
      Cookies.remove("token");
      router.push({ name: "login" });
    },
  },
});
