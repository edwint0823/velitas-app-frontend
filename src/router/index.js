import { createRouter, createWebHistory } from "vue-router";
import auth_routes from "./auth.router.js";
import order_routes from "./orders.router.js";
import candle_inventory_routes from "./candle_inventory.router.js";
import bag_inventory_routes from "@/router/bag_inventory.router.js";
import mainRoutes from "./main_routes.router.js";
import cash_movements_routes from "@/router/cash_movements.router.js";

const routes = [
  ...order_routes,
  ...candle_inventory_routes,
  ...bag_inventory_routes,
  ...cash_movements_routes,
  ...auth_routes,
  ...mainRoutes,
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const { title } = to.meta;
  const str = `${title || "INICIO"} | VELITAS APP`;
  document.title = str.toUpperCase();
});
export default router;
