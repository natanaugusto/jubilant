<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Clientes</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Cliente</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="clients"
      :hide-default-footer="true"
      :items-per-page="-1"
      class="mt-4"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="remove(item.id_cliente)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="showForm" max-width="500px">
      <v-card>
        <v-card-title>{{ form.id_cliente ? "Editar" : "Novo" }} Cliente</v-card-title>
        <v-card-text>
          <v-text-field label="Nome" v-model="form.nome" />
          <v-text-field label="E-mail" v-model="form.email" />
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

const clients = ref([])
const showForm = ref(false)
const form = ref({ id_cliente: null, nome: "", email: "" })

const headers = [
  { title: "ID", value: "id_cliente" },
  { title: "Nome", value: "nome" },
  { title: "E-mail", value: "email" },
  { title: "Ações", value: "actions", sortable: false }
]

const Clientes = async () => {
  const { data } = await axios.get("/api/clients")
  clients.value = data
}

const openForm = () => {
  form.value = { id_cliente: null, nome: "", email: "" }
  showForm.value = true
}

const edit = (item) => {
  form.value = { ...item }
  showForm.value = true
}

const save = async () => {
  if (form.value.id_cliente) {
    await axios.put(`/api/clients/${form.value.id_cliente}`, form.value)
  } else {
    await axios.post("/api/clients", form.value)
  }
  showForm.value = false
  await Clientes()
}

const remove = async (id) => {
  await axios.delete(`/api/clients/${id}`)
  await Clientes()
}

onMounted(Clientes)
</script>
