<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Pedidos</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Pedido</v-btn>
    </v-toolbar>

    <v-data-table :headers="headers" :items="orders" class="mt-4">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="remove(item.id_pedido)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="showForm" max-width="500px">
      <v-card>
        <v-card-title>{{ form.id_pedido ? "Editar" : "Novo" }} Pedido</v-card-title>
        <v-card-text>
          <v-text-field label="Data" v-model="form.data" type="date" />
          <v-select
            label="Cliente"
            v-model="form.id_cliente"
            :items="clients"
            item-title="nome"
            item-value="id_cliente"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showForm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "../axios"

const orders = ref([])
const clients = ref([])
const showForm = ref(false)
const form = ref({ id_pedido: null, data: "", id_cliente: "" })

const headers = [
  { text: "ID", value: "id_pedido" },
  { text: "Data", value: "formatted" },
  { text: "Cliente", value: "cliente" },
  { text: "Ações", value: "actions", sortable: false }
]

const Pedidos = async () => {
  const { data: ordersData } = await axios.get("/api/orders")
  const { data: clientsData } = await axios.get("/api/clients")
  ordersData.forEach((order, index) => {
    ordersData[index].cliente = clientsData.find(
      (client) => client.id_cliente === order.id_cliente
    )?.nome

    ordersData[index].formatted = new Date(`${order.data}T00:00:00-03:00`).toLocaleDateString(
      "pt-BR"
    )
  })

  orders.value = ordersData
  clients.value = clientsData
}

const openForm = () => {
  form.value = { id_pedido: null, data: "", id_cliente: "" }
  showForm.value = true
}

const edit = (item) => {
  form.value = { ...item }
  showForm.value = true
}

const save = async () => {
  if (form.value.id_pedido) {
    await axios.put(`/api/orders/${form.value.id_pedido}`, form.value)
  } else {
    await axios.post("/api/orders", form.value)
  }
  showForm.value = false
  await Pedidos()
}

const remove = async (id) => {
  await axios.delete(`/api/orders/${id}`)
  await Pedidos()
}

onMounted(Pedidos)
</script>
