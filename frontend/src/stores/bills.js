import { defineStore } from 'pinia'
import axios from 'axios'

export const useFactureStore = defineStore('facture', {
  state: () => ({
    factures: [],
    facture: {}
  }),
  actions: {
    async getAllFactures() {
      try {
        const response = await axios.get('http://localhost:3000/factures')
        this.factures = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error)
      }
    },
    async onDeleteFacture(id) {
      try {
        await axios.delete(`http://localhost:3000/factures/${id}`)
        this.factures = this.factures.filter((facture) => facture.id !== id)
        if (this.facture.id === id) {
          this.facture = {}
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de la facture:', error)
      }
    },
    async onSetFacture(id) {
      try {
        const response = await axios.get(`http://localhost:3000/factures/${id}`)
        this.facture = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération de la facture:', error)
      }
    },
    async onUpdateFacture(facture) {
      try {
        console.log(facture)
        const response = await axios.patch(`http://localhost:3000/factures/${facture.id}`, facture)
        const updatedFactureIndex = this.factures.findIndex((f) => f.id === facture.id)
        if (updatedFactureIndex !== -1) {
          this.factures[updatedFactureIndex] = response.data
        }
        this.facture = response.data
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la facture:', error)
      }
    },
    async onCreateFacture(newFacture) {
      try {
        const response = await axios.post('http://localhost:3000/factures', newFacture)
        this.factures.push(response.data)
        this.facture = response.data
      } catch (error) {
        console.error('Erreur lors de la création de la facture:', error)
        throw error
      }
    }
  }
})
