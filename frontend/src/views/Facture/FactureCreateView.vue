<template>
  <div class="container py-5">
    <HeaderPage
      title="Créer une nouvelle facture"
      description="Remplissez les informations ci-dessous pour créer une nouvelle facture."
    />

    <div class="d-flex">
      <FormInput
        id="factureId"
        label="Facture N°:"
        v-model="facture.billnum"
        :readonly="isReadonly"
      />
      <FormInput
        id="descriptionFacture"
        label="Description"
        v-model="facture.description"
        :readonly="false"
      />
    </div>

    <FormInput
      id="dateEmition"
      label="Emis le :"
      type="date"
      v-model="facture.date"
      :readonly="isReadonly"
    />

    <div class="form-group row w-50 mb-3">
      <label for="client" class="col-sm-2 col-form-label">Client</label>
      <div class="col-sm-10">
        <select
          v-model="facture.clientId"
          class="form-control border border-secondary w-50"
          :class="{ 'is-invalid': !facture.clientId }"
          id="client"
        >
          <option value="">Merci de choisir un client</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.firstName }} {{ client.lastName }}
          </option>
        </select>
      </div>
    </div>

    <table class="table">
      <thead class="table-secondary">
        <tr>
          <th class="text-secondary" style="width: 10%">Action</th>
          <th class="text-secondary w-50">Prestation</th>
          <th class="text-secondary">Quantité</th>
          <th class="text-secondary">Montant unitaire</th>
          <th class="text-secondary">Montant total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in facture.prestations" :key="index">
          <td>
            <button class="btn btn-lg" @click="addPrestation">
              <i class="fa-solid fa-circle-plus text-primary"></i>
            </button>
            <button
              class="btn btn-lg"
              @click="removePrestation(index)"
              :disabled="facture.prestations.length === 1"
            >
              <i class="fa-solid fa-trash text-danger"></i>
            </button>
          </td>
          <td>
            <input type="text" class="form-control" v-model="item.description" />
          </td>
          <td>
            <input type="number" class="form-control" v-model="item.qty" @input="calculateTotal" />
          </td>
          <td>
            <input
              type="number"
              class="form-control"
              v-model="item.price"
              @input="calculateTotal"
            />
          </td>
          <td>
            <input
              type="text"
              class="form-control"
              :value="(item.price * item.qty).toFixed(2)"
              readonly
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>Remises</td>
          <td>
            <input
              type="number"
              class="form-control border border-secondary"
              v-model="facture.discount"
              @input="calculateTotal"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>Déjà payé</td>
          <td>
            <input
              type="number"
              class="form-control border border-secondary"
              v-model="facture.paid"
              @input="calculateTotal"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>Total HT</td>
          <td>
            <input
              type="text"
              class="form-control text-secondary"
              style="background-color: lightgray"
              disabled
              :value="facture.totalHT.toFixed(2)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>TVA (20%)</td>
          <td>
            <input
              type="text"
              class="form-control text-secondary"
              style="background-color: lightgray"
              disabled
              :value="facture.tva.toFixed(2)"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>Montant TTC</td>
          <td>
            <input
              type="text"
              class="form-control bg-secondary text-white"
              disabled
              :value="facture.totalTTC.toFixed(2)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-success mb-5" @click="saveFacture" :disabled="!isValidForm">
      Sauvegarder
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useFactureStore } from '@/stores/bills'
import FormInput from '@/components/FormInput.vue'
import HeaderPage from '@/components/common/HeaderPage.vue'
import { mapState, mapActions } from 'pinia'
import { useClientStore } from '@/stores/clients'

export default defineComponent({
  components: {
    FormInput,
    HeaderPage
  },
  data() {
    return {
      isReadonly: false,
      facture: {
        billnum: '',
        description: '',
        date: new Date().toISOString().substr(0, 10),
        clientId: '',
        prestations: [
          {
            description: '',
            qty: 0,
            price: 0
          }
        ],
        discount: 0,
        paid: 0,
        totalHT: 0,
        tva: 0,
        totalTTC: 0
      }
    }
  },
  computed: {
    isValidForm() {
      return (
        this.facture.clientId && this.facture.description && this.facture.prestations.length > 0
      )
    },
    ...mapState(useClientStore, ['clients'])
  },
  created() {
    this.getAllClients()
  },
  methods: {
    ...mapActions(useFactureStore, ['onCreateFacture']),
    ...mapActions(useClientStore, ['getAllClients']),

    removePrestation(index) {
      this.facture.prestations.splice(index, 1)
      this.calculateTotal()
    },
    calculateTotal() {
      let totalHT = 0
      this.facture.prestations.forEach((item) => {
        totalHT += item.qty * item.price
      })
      totalHT -= parseFloat(this.facture.discount) || 0
      totalHT -= parseFloat(this.facture.paid) || 0
      this.facture.totalHT = totalHT
      this.facture.tva = totalHT * 0.2
      this.facture.totalTTC = totalHT * 1.2
    },
    addPrestation() {
      this.facture.prestations.push({
        description: '',
        qty: 0,
        price: 0
      })
    },
    async saveFacture() {
      try {
        await this.onCreateFacture(this.facture)
        console.log(this.facture)
        this.$router.push({ path: '/factures' })
      } catch (error) {
        console.error('Erreur lors de la création de la facture:', error)
      }
    }
  }
})
</script>
