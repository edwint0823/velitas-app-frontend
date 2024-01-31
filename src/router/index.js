import {createRouter, createWebHistory} from "vue-router";
import auth_routes from "./auth_router.js";
import order_routes from './orders_router.js'
import mainRoutes from "./main_routes.js"

const routes = [...auth_routes,...mainRoutes,  ...order_routes]
const router = createRouter({
    history: createWebHistory(),
    // scrollBehavior(to, from, savedPosition) {
    //     return savedPosition || {left: 0, top: 0};
    // },
    routes,
});

router.beforeEach((to) => {
    const {title} = to.meta;
    const str = `${title || "INICIO"} | VELITAS APP`;
    document.title = str.toUpperCase();

});
export default router;