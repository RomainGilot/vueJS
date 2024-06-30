<template>
  <div class="container py-5">
    <HeaderPage
      title="Tableau de bord"
      description="Bienvenue sur le tableau de bord de la gestion des factures et des clients."
    >
      <template v-slot:button>
        <RouterLink to="/factures/ajouter">
          <ButtonHeader
            icon='<i class="fa-solid fa-circle-plus"></i>'
            text="Ajouter une facture"
            color="success"
          />
        </RouterLink>
        <RouterLink to="/clients/ajouter">
          <ButtonHeader
            icon='<i class="fa-solid fa-user"></i>'
            text="Ajouter un client"
            color="primary ms-3"
          />
        </RouterLink>
      </template>
    </HeaderPage>

    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title title">
              {{ currentYearInvoiceCount }} Factures en {{ currentYear }}
            </h5>
            <div class="chart-container">
              <canvas id="invoiceChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card mb-4">
          <div class="card-title ps-3 pt-3 title">Factures en cours</div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Montant HT</th>
                  <th>Montant TTC</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in invoices" :key="invoice.id">
                  <td>{{ invoice.billnum }}</td>
                  <td>{{ factureClientName(invoice.clientId) }}</td>
                  <td>{{ invoice.totalHT }} € HT</td>
                  <td>{{ invoice.totalTTC }} € TTC</td>
                  <td><a href="#" class="btn btn-link">Éditer</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-title ps-3 pt-3 title">Clients</div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Nom du contact</th>
                  <th>Entreprise</th>
                  <th>Date d'ajout</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="client in clients" :key="client.id">
                  <td>{{ client.firstName + ' ' + client.lastName }}</td>
                  <td>{{ client.companyName }}</td>
                  <td>{{ formatDate(client.addedDate) }}</td>
                  <td><a href="#" class="btn btn-link">Éditer</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import { RouterLink } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import { useClientStore } from '@/stores/clients'
import { useFactureStore } from '@/stores/bills'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

Chart.register(...registerables)

export default {
  components: {
    HeaderPage,
    ButtonHeader,
    RouterLink
  },
  setup() {
    const clientStore = useClientStore()
    const billStore = useFactureStore()

    const invoices = ref([])
    const clients = ref([])
    const currentYear = new Date().getFullYear()
    const currentYearInvoiceCount = ref(0)

    onMounted(async () => {
      try {
        await clientStore.getAllClients()
        await billStore.getAllFactures()

        clients.value = clientStore.clients.slice(0, 5)

        const currentYearInvoices = billStore.factures.filter((invoice) => {
          const invoiceYear = new Date(invoice.date).getFullYear()
          return invoiceYear === currentYear
        })

        invoices.value = currentYearInvoices.slice(0, 5)
        currentYearInvoiceCount.value = currentYearInvoices.length

        updateInvoiceChart(currentYearInvoices)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
      }
    })

    const updateInvoiceChart = (invoices) => {
      const ctx = document.getElementById('invoiceChart').getContext('2d')
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Encaissée TTC', 'Total Facturé TTC', "Dû à plus d'un mois TTC"],
          datasets: [
            {
              data: [
                calculateTotalEncaisseeTTC(invoices),
                calculateTotalFactureTTC(invoices),
                calculateDuAPlusUnMoisTTC(invoices)
              ],
              backgroundColor: ['#007bff', '#dc3545', '#ffc107']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    const calculateTotalEncaisseeTTC = (invoices) => {
      return 1000
    }

    const calculateTotalFactureTTC = (invoices) => {
      return invoices.reduce((total, invoice) => {
        return total + invoice.totalTTC
      }, 0)
    }

    const calculateDuAPlusUnMoisTTC = (invoices) => {
      return 2000
    }

    return {
      invoices,
      clients,
      currentYearInvoiceCount
    }
  },
  methods: {
    formatDate(date) {
      return format(date, 'dd/MM/yyyy', { locale: fr })
    },
    factureClientName(clientId) {
      const client = this.clients.find((c) => c.id === clientId)
      if (client) {
        return `${client.firstName || 'Unknown'} ${client.lastName || 'Client'}`
      } else {
        return 'Client inconnu'
      }
    }
  }
}
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
}

.chart-container {
  position: relative;
  height: 400px;
}
</style>
