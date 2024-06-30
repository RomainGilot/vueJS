<template>
  <div class="container py-5">
    <HeaderPage
      title="Liste des factures"
      description="Retrouvez ci-dessous la liste de toutes les factures."
    >
      <template v-slot:button>
        <RouterLink to="/factures/ajouter">
          <ButtonHeader
            icon='<i class="fa-solid fa-circle-plus"></i>'
            text="Ajouter la facture"
            color="success"
          />
        </RouterLink>
      </template>
    </HeaderPage>

    <DataTable
      :rows="facturesWithClients"
      :columns="tableColumns"
      entity="factures"
      :onDelete="deleteFacture"
    />
  </div>
</template>

<script>
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import DataTable from '@/components/DataTable.vue'
import { useFactureStore } from '@/stores/bills'
import { mapState, mapActions } from 'pinia'
import { RouterLink } from 'vue-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useClientStore } from '@/stores/clients'

export default {
  data() {
    return {
      keywords: '',
      clientInfo: '',
      tableColumns: [
        { label: 'N° de facture', prop: 'billnum' },
        { label: 'Description', prop: 'description' },
        { label: 'Date', prop: 'formattedDate' },
        { label: 'Client', prop: 'clientInfo' },
        { label: 'Prix HT', prop: 'totalHT' },
        { label: 'Prix TTC', prop: 'totalTTC' }
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
    ...mapState(useFactureStore, ['factures']),
    ...mapState(useClientStore, ['clients']),
    facturesWithClients() {
      return this.factures.map((facture) => {
        const client = this.clients.find((c) => c.id === facture.clientId)
        if (client) {
          return {
            ...facture,
            formattedDate: this.formatDate(facture.date),
            clientInfo: `${client.firstName || 'Unknown'} ${client.lastName || 'Client'}`
          }
        } else {
          return {
            ...facture,
            formattedDate: this.formatDate(facture.date),
            clientInfo: 'Client inconnu'
          }
        }
      })
    }
  },
  async mounted() {
    await this.getAllFactures()
  },
  methods: {
    ...mapActions(useFactureStore, ['getAllFactures', 'onDeleteFacture']),
    ...mapActions(useClientStore, ['getAllClients']),
    async deleteFacture(factureId) {
      await this.onDeleteFacture(factureId)
      await this.getAllFactures()
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
    }
  },
  created() {
    this.clients = this.getAllClients()
  }
}
</script>
