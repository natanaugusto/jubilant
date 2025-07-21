<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Pedidos</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Pedido</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="orders"
      :hide-default-footer="true"
      :items-per-page="-1"
      class="mt-4"
    >
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
          <v-select
            label="Produto"
            v-model="selectedProduct"
            :items="availableProducts"
            item-title="nome"
            item-value="id_produto"
            @update:modelValue="addProduct"
          />
          <v-data-table
            :headers="itemsHeaders"
            :items="form.items"
            :hide-default-footer="true"
            :items-per-page="-1"
          >
            <template v-slot:[`item.qtde`]="{ item }">
              <v-text-field
                v-model.number="item.qtde"
                type="number"
                min="1"
                dense
                hide-details
                @input="changeQntde(item)"
              />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon @click="removeItem(item.id_produto)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
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
const products = ref([])
const availableProducts = ref([])
const showForm = ref(false)
const selectedProduct = ref(null)
const form = ref({ id_pedido: null, data: "", id_cliente: "", items: [] })

const headers = [
  { title: "ID", value: "id_pedido" },
  { title: "Data", value: "formatted" },
  { title: "Cliente", value: "cliente" },
  { title: "Total", value: "total" },
  { title: "Ações", value: "actions", sortable: false }
]

const itemsHeaders = [
  { title: "Produto", value: "nome" },
  { title: "Qtde", value: "qtde" },
  { title: "Preço", value: "preco" },
  { title: "Ações", value: "actions", sortable: false }
]

const Pedidos = async () => {
  const [ordersResponse, clientsResponse, productsResponse] = await Promise.all([
    axios.get("/api/orders"),
    axios.get("/api/clients"),
    axios.get("/api/products")
  ])

  const ordersData = ordersResponse.data
  const clientsData = clientsResponse.data
  const productsData = productsResponse.data

  const clientMap = new Map(clientsData.map((client) => [client.id_cliente, client.nome]))
  const productMap = new Map(productsData.map((product) => [product.id_produto, product.nome]))

  const itemPromises = ordersData.map((order) =>
    axios.get(`/api/orders/${order.id_pedido}/items`).then((res) => ({
      id_pedido: order.id_pedido,
      items: res.data
    }))
  )
  const itemsResponses = await Promise.all(itemPromises)
  const itemsMap = new Map(itemsResponses.map((response) => [response.id_pedido, response.items]))

  const transformedOrders = ordersData.map((order) => ({
    ...order,
    cliente: clientMap.get(order.id_cliente) || "Unknown",
    formatted: new Date(`${order.data}T00:00:00-03:00`).toLocaleDateString("pt-BR"),
    items: (itemsMap.get(order.id_pedido) || []).map((item) => ({
      ...item,
      nome: productMap.get(item.id_produto) || "Unknown"
    }))
  }))

  // Assign to reactive state
  clients.value = clientsData
  products.value = productsData
  orders.value = transformedOrders
}

const openForm = async () => {
  availableProducts.value = [...products.value]
  form.value = { id_pedido: null, data: "", id_cliente: "", items: [] }
  selectedProduct.value = null
  showForm.value = true
}

const save = async () => {
  const { id_cliente, data, items } = form.value
  let { id_pedido } = form.value

  if (id_pedido) {
    await axios.put(`/api/orders/${id_pedido}`, { id_cliente, id_pedido, data })
  } else {
    const response = await axios.post("/api/orders", { id_cliente, id_pedido, data })
    id_pedido = response.data.id
  }
  await axios.post(`/api/orders/${id_pedido}/items`, items)
  showForm.value = false
  await Pedidos()
}

const remove = async (id) => {
  await axios.delete(`/api/orders/${id}`)
  await Pedidos()
}

const edit = (item) => {
  form.value = { ...item }
  availableProducts.value = products.value.filter(
    (p) => !item.items.some((i) => i.id_produto === p.id_produto)
  )
  showForm.value = true
}

const addProduct = (productId) => {
  if (!productId) return

  const product = getProductsById(productId)
  if (product) {
    form.value.items.push({
      id_produto: product.id_produto,
      nome: product.nome,
      qtde: 1,
      preco: product.preco
    })

    availableProducts.value = availableProducts.value.filter((p) => p.id_produto !== productId)
    selectedProduct.value = null
  }
}

const removeItem = (productId) => {
  const product = form.value.items.find((p) => p.id_produto === productId)
  if (product) {
    availableProducts.value.push(getProductsById(productId))
    form.value.items = form.value.items.filter((p) => p.id_produto !== productId)
  }
}

const changeQntde = (item) => {
  if (!item.qtde || item.qtde < 1) {
    item.qtde = 1 // Reset to 1 if invalid
  }

  const { preco } = getProductsById(item.id_produto)
  item.preco = preco * item.qtde
}

function getProductsById(productId) {
  return products.value.find((p) => p.id_produto === productId)
}

onMounted(Pedidos)
</script>
