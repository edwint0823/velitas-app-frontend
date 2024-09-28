import auth from "../middleware/auth.middleware";

export default [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/auth/login.vue"),
        beforeEnter: [auth],
        meta: {title: "LOGIN"}
    }
];
