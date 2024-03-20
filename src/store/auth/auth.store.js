import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

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
    },
  },
});
