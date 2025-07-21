<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Produtos</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Produto</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="products"
      :hide-default-footer="true"
      :items-per-page="-1"
      class="mt-4"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="remove(item.id_produto)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="showForm" max-width="500px">
      <v-card>
        <v-card-title>{{ form.id_produto ? "Editar" : "Novo" }} Produto</v-card-title>
        <v-card-text>
          <v-text-field label="Nome" v-model="form.nome" />
          <v-text-field label="Preço" v-model="form.preco" type="number" />
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

const products = ref([])
const showForm = ref(false)
const form = ref({ id_produto: null, nome: "", preco: "" })
const endpoint = "/api/products"

const headers = [
  { title: "ID", value: "id_produto" },
  { title: "Nome", value: "nome" },
  { title: "Preço", value: "preco" },
  { title: "Ações", value: "actions", sortable: false }
]

const fetchProdutos = async () => {
  const { data } = await axios.get(endpoint)
  products.value = data
}

const openForm = () => {
  form.value = { id_produto: null, nome: "", preco: "" }
  showForm.value = true
}

const edit = (item) => {
  form.value = { ...item }
  showForm.value = true
}

const save = async () => {
  if (form.value.id_produto) {
    await axios.put(`/api/products/${form.value.id_produto}`, form.value)
  } else {
    await axios.post(endpoint, form.value)
  }
  showForm.value = false
  await fetchProdutos()
}

const remove = async (id) => {
  await axios.delete(`/api/products/${id}`)
  await fetchProdutos()
}

onMounted(fetchProdutos)
</script>
