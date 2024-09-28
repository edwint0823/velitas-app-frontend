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
      {
        path: "/list-candle-options",
        name: "list_candle_options",
        component: () => import("../views/configPages/ListCandleOptions.vue"),
        meta: { title: "Opciones de vela" },
      },
      {
        path: "/edit-candle-option/:id",
        name: "edit_candle_option",
        component: () => import("../views/configPages/EditCandleOption.vue"),
        meta: { title: "Editar opción de vela" },
      },
      {
        path: "/create-candle-option",
        name: "create_candle_option",
        component: () => import("../views/configPages/CreateCandleOption.vue"),
        meta: { title: "Crear opción de vela" },
      },
    ],
  },
];
