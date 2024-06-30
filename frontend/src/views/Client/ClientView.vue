<template>
  <div class="container py-5">
    <HeaderPage
      title="Liste des clients"
      description="Retrouvez ci-dessous la liste de tous les clients."
    >
      <template v-slot:button>
        <RouterLink to="/clients/ajouter">
          <ButtonHeader
            icon='<i class="fa-solid fa-circle-plus"></i>'
            text="Ajouter un client"
            color="success"
          />
        </RouterLink>
      </template>
    </HeaderPage>

    <DataTable
      :rows="clientsWithFormattedDate"
      :columns="tableColumns"
      entity="clients"
      :onDelete="deleteClient"
    />
  </div>
</template>

<script>
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import DataTable from '@/components/DataTable.vue'
import { useClientStore } from '@/stores/clients'
import { mapState, mapActions } from 'pinia'
import { RouterLink } from 'vue-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  data() {
    return {
      keywords: '',
      tableColumns: [
        { label: 'Nom', prop: 'clientName' },
        { label: 'Entreprise', prop: 'companyName' },
        { label: "Date d'ajout", prop: 'formattedAddedDate' }
      ]
    }
  },
  components: {
    HeaderPage,
    ButtonHeader,
    DataTable,
    RouterLink
  },
  computed: {
    ...mapState(useClientStore, ['clients']),
    clientsWithFormattedDate() {
      return this.clients.map((client) => ({
        ...client,
        formattedAddedDate: this.formatDate(client.addedDate)
      }))
    }
  },
  async mounted() {
    await this.getAllClients()
  },
  methods: {
    ...mapActions(useClientStore, ['getAllClients', 'onDeleteClient']),
    async deleteClient(clientId) {
      await this.onDeleteClient(clientId)
      await this.getAllClients()
    },
    formatDate(date) {
      return format(date, 'dd/MM/yyyy', { locale: fr })
    }
  }
}
</script>
