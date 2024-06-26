import Cookies from "js-cookie";

export default async (to, from, next) => {
  const token = Cookies.get("token");
  const val = token === undefined;

  if (val) {
    // no autenticado
    if (["create_order", "search_order", "login"].includes(to.name)) {
      next();
    } else if (to.name !== "login") next({ name: "login" });
  } else {
    // autenticado
    if (to.name === "login") {
      next({ name: "login" });
    } else {
      next();
    }
  }
};
