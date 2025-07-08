import { createRouter, createWebHistory } from "vue-router";

import Orders from "./pages/Orders.vue";
import Clients from "./pages/Clients.vue";
import Products from "./pages/Products.vue";

const routes = [
  { path: "/", redirect: "/products" },
  { path: "/produtos", component: Products },
  { path: "/clientes", component: Clients },
  { path: "/pedidos", component: Orders },
];

export default createRouter({
  history: createWebHistory(),
  routes
});