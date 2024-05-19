import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    children: [
      {
        path: "/list-cash-movements",
        name: "list_cash_movements",
        component: () => import("../views/cashMovements/List.vue"),
        meta: { title: "Transacciones" },
      },
    ],
  },
];
