<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item-title class="text-h6">Jubilant</v-list-item-title>
        <v-divider />

        <v-list-item
          v-for="item of navItems"
          :key="item.title"
          :to="item.to"
          :link="true"
          :router="true"
        >
          <v-list-item-icon
            ><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
          >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const navItems = [
  { title: "Produtos", icon: "mdi-cart", to: "/produtos" },
  { title: "Clientes", icon: "mdi-account", to: "/clientes" },
  { title: "Pedidos", icon: "mdi-receipt", to: "/pedidos" }
  // { title: 'Pedido Itens', icon: 'mdi-format-list-bulleted', to: '/pedido-itens' },
]
</script>
