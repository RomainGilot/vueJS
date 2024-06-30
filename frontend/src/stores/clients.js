import { defineStore } from 'pinia'
import axios from 'axios'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    client: {}
  }),
  actions: {
    async getAllClients() {
      try {
        const response = await axios.get('http://localhost:3000/clients')
        this.clients = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error)
      }
    },
    async onSetClient(id) {
      try {
        const response = await axios.get(`http://localhost:3000/clients/${id}`)
        this.client = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération du client:', error)
      }
    },
    async onUpdateClient(client) {
      try {
        const response = await axios.patch(`http://localhost:3000/clients/${client.id}`, client)
        const index = this.clients.findIndex((f) => f.id === client.id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        this.client = response.data
      } catch (error) {
        console.error('Erreur lors de la mise à jour du client:', error)
      }
    },
    async onDeleteClient(id) {
      try {
        await axios.delete(`http://localhost:3000/clients/${id}`)
        this.clients = this.clients.filter((b) => b.id !== id)
        if (this.client.id === id) {
          this.client = {}
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error)
      }
    },
    async onCreateClient(client) {
      try {
        const response = await axios.post('http://localhost:3000/clients', client)
        this.clients.push(response.data)
        this.client = response.data
      } catch (error) {
        console.error('Erreur lors de la création du client:', error)
        throw error
      }
    }
  }
})
