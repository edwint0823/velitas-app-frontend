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
      {
        path: "/cash-available",
        name: "cash_available",
        component: () => import("../views/cashMovements/CashAvailable.vue"),
        meta: { title: "Dinero físico disponible" },
      },
    ],
  },
];
