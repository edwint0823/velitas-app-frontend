import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    children: [
      {
        path: "/list-config-params",
        name: "list_config_params",
        component: () => import("../views/configPages/ListConfigParams.vue"),
        meta: { title: "Parámetros" },
      },
    ],
  },
];
