import auth from "../middleware/auth.middleware";

export default [
    {
        path: '/',
        component: () => import("../layout/main.vue"),
        beforeEnter: [auth],
        redirect: {name: 'create_order'},
        children: [
            {
                path: '/create-order',
                name: "create_order",
                component: () => import( "../views/orders/create_order.vue"),
                meta: {title: 'Crear Pedido'}
            },
            {
                path: '/list-orders',
                name: "list_orders",
                component: () => import( "../views/orders/list_order.vue"),
                meta: {title: 'Listar Pedidos'}
            },
            {
                path: '/view-order-by-code/:code',
                name: "view_order_by_code",
                component: () => import( "../views/orders/view_order_by_code.vue"),
                meta: {title: 'Ver pedido'}
            }
        ]
    }
]