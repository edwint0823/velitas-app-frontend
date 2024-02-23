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
                component: () => import( "../views/orders/CreateOrder.vue"),
                meta: {title: 'Crear Pedido'}
            },
            {
                path: '/list-orders',
                name: "list_orders",
                component: () => import( "../views/orders/ListOrder.vue"),
                meta: {title: 'Listar Pedidos'}
            },
            {
                path: '/search-order/:code?',
                name: "search_order",
                component: () => import( "../views/orders/SearchOrder.vue"),
                meta: {title: 'Buscar pedido'}
            }
        ]
    }
]