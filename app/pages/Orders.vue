<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Orders</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Order</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="produtos"
      class="mt-4"
    >
      <template #item.actions="{ item }">
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
        <v-card-title>{{ form.id_produto ? 'Editar' : 'Novo' }} Order</v-card-title>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

const produtos = ref([])
const showForm = ref(false)
const form = ref({ id_produto: null, nome: '', preco: '' })

const headers = [
  { text: 'ID', value: 'id_produto' },
  { text: 'Nome', value: 'nome' },
  { text: 'Preço', value: 'preco' },
  { text: 'Ações', value: 'actions', sortable: false },
]

const Orders = async () => {
  // const { data } = await axios.get('/api/produtos')
  produtos.value = []
}

const openForm = () => {
  form.value = { id_produto: null, nome: '', preco: '' }
  showForm.value = true
}

const edit = (item) => {
  form.value = { ...item }
  showForm.value = true
}

const save = async () => {
  if (form.value.id_produto) {
    await axios.put(`/api/produtos/${form.value.id_produto}`, form.value)
  } else {
    await axios.post('/api/produtos', form.value)
  }
  showForm.value = false
  await Orders()
}

const remove = async (id) => {
  await axios.delete(`/api/produtos/${id}`)
  await Orders()
}

onMounted(Orders)
</script>