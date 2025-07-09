import { createRouter, createWebHistory } from "vue-router"

import Orders from "./pages/GridOrders.vue"
import Clients from "./pages/GridClients.vue"
import Products from "./pages/GridProducts.vue"

const routes = [
  { path: "/", redirect: "/products" },
  { path: "/produtos", component: Products },
  { path: "/clientes", component: Clients },
  { path: "/pedidos", component: Orders }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
