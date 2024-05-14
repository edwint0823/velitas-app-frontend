import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    children: [
      {
        path: "/list-bag-inventory",
        name: "list_bag_inventory",
        component: () => import("../views/bagInventory/List.vue"),
        meta: { title: "Inventario de bolsas" },
      },
    ],
  },
];
