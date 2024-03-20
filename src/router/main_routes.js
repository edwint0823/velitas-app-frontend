import auth from "../middleware/auth.middleware";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    redirect: { name: "dashboard" },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/dashboard/dashboard.vue"),
        beforeEnter: [auth],
        meta: { title: "DASHBOARD" },
      },
    ],
  },
];
