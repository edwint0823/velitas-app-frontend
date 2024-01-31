import auth from "../middleware/auth.middleware";

export default [
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/dashboard/dashboard.vue"),
        beforeEnter: [auth],
        meta: {title: "DASHBOARD"}
    }
];
