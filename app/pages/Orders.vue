<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Orders</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openForm()">Novo Order</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="orders"
      class="mt-4"
    >
      <template #item.actions="{ item }">
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
        <v-card-title>{{ form.id_pedido ? 'Editar' : 'Novo' }} Order</v-card-title>
        <v-card-text>
          <v-text-field label="Data" v-model="form.data" type="date" />
          <v-select label="Cliente" v-model="form.id_cliente" :items="clients" item-title="nome" item-value="id_cliente" />
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
import axios from '../axios'

const orders = ref([])
const clients = ref([])
const showForm = ref(false)
const form = ref({ id_pedido: null, data: '', id_cliente: '' })

const headers = [
  { text: 'ID', value: 'id_pedido' },
  { text: 'Data', value: 'data' },
  { text: 'Cliente', value: 'id_cliente' },
  { text: 'Ações', value: 'actions', sortable: false },
]

const Orders = async () => {
  const { data } = await axios.get('/api/orders')
  orders.value = data

  const { data: clientsData } = await axios.get('/api/clients')
  clients.value = clientsData
}

const openForm = () => {
  form.value = { id_pedido: null, data: '', id_cliente: '' }
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
    await axios.post('/api/orders', form.value)
  }
  showForm.value = false
  await Orders()
}

const remove = async (id) => {
  await axios.delete(`/api/orders/${id}`)
  await Orders()
}

onMounted(Orders)
</script>