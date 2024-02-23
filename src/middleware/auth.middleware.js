export default async (to, from, next) => {
  // console.log("AUTH-MIDDLEWARE", to, from, next);
  const val = false;

  if (val) {
    // alert("No estas autenticado");
    // Cookie.remove("token");
    // Cookie.remove("user");
    if (to.name !== "login") next({ name: "login" });
    next();
  } else {
    // alert("Estas autenticado");
    if (to.name === "login") {
      next({ name: "login" });
    } else {
      next();
    }
  }
};
/*import Cookie from "js-cookie";
import { useAuthStore } from "../views/auth/stores/auth.store";
export default async (to, from, next) => {
    const auth = useAuthStore();
    // console.log("AUTH-MIDDLEWARE", to, from, next);
    if (!auth.getToken || !auth.getUser) {
        // alert("No estas autenticado");
        Cookie.remove("token");
        Cookie.remove("user");
        if (to.name !== "login") next({ name: "login" });
        next();
    } else {
        // alert("Estas autenticado");
        if (to.name === "login") {
            next("/");
        } else {
            next();
        }
    }
};*/
