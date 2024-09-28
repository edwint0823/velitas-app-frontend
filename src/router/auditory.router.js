import auth from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/",
    component: () => import("../layout/main.vue"),
    beforeEnter: [auth],
    redirect: { name: "list_candle_inventory_movements" },
    children: [
      {
        path: "/list-candle-inventory-movements",
        name: "list_candle_inventory_movements",
        component: () => import("../views/auditPages/candleInventoryMovements.vue"),
        meta: { title: "Mov. Inv. velas" },
      },
      {
        path: "/list-bags-inventory-movements",
        name: "list_bags_inventory_movements",
        component: () => import("../views/auditPages/bagInventoryMovements.vue"),
        meta: { title: "Mov. Inv. bolsas" },
      },
      {
        path: "/list-order-change-status-logs",
        name: "list_order_change_status_logs",
        component: () => import("../views/auditPages/orderStatusChangeLogList.vue"),
        meta: { title: "Cambios estado de pedido" },
      },
    ],
  },
];
