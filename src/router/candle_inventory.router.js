import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    children: [
      {
        path: "/list-candle-inventory",
        name: "list_candle_inventory",
        component: () => import("../views/candleInventory/List.vue"),
        meta: { title: "Inventario de velas" },
      },
    ],
  },
];
