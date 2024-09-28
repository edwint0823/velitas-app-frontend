import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    children: [
      {
        path: "/list-customers",
        name: "list_customers",
        component: () => import("../views/customers/List.vue"),
        meta: { title: "Clientes" },
      },
    ],
  },
];
