<template>
  <div class="container py-5" v-if="facture">
    <HeaderPage
      title="Éditer une facture"
      description="Retrouvez ci-dessous la liste de toutes les factures."
    >
      <template v-slot:button>
        <ButtonHeader
          icon='<i class="fa-solid fa-trash"></i>'
          text="Supprimer la facture"
          color="danger"
          @click="deleteFacture(facture.id)"
        />
        <RouterLink to="/factures" class="ms-3">
          <ButtonHeader
            icon='<i class="fa-solid fa-arrow-left-long"></i>'
            text="Retour"
            color="primary"
          />
        </RouterLink>
        <button
          class="ms-3 btn btn-sm border-3 border-success text-success py-2 fw-bold rounded-lg"
          :disabled="!facture.clientId || !facture.description"
          @click="saveFacture"
        >
          <i class="fa-solid fa-save"></i>
          Sauvegarer
        </button>
      </template>
    </HeaderPage>

    <div class="d-flex mb-3">
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
        @input="updateDescription($event.target.value)"
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
            <input
              type="text"
              class="form-control"
              v-model="item.qty"
              @input="updateQuantity(index, $event.target.value)"
            />
          </td>
          <td>
            <input
              type="text"
              class="form-control"
              v-model="item.price"
              @input="updatePrice(index, $event.target.value)"
            />
          </td>
          <td>
            <input type="text" class="form-control" :value="item.price * item.qty" readonly />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td>Remises</td>
          <td>
            <input
              type="text"
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
              type="text"
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
              v-model="facture.totalHT"
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
              v-model="facture.tva"
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
              v-model="facture.totalTTC"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useFactureStore } from '@/stores/bills'
import { useClientStore } from '@/stores/clients'

import FormInput from '@/components/FormInput.vue'
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import { mapState, mapActions } from 'pinia'
import { RouterLink } from 'vue-router'

export default defineComponent({
  components: {
    FormInput,
    HeaderPage,
    ButtonHeader,
    RouterLink
  },
  data() {
    return {
      isReadonly: true
    }
  },
  computed: {
    ...mapState(useFactureStore, ['facture']),
    ...mapState(useClientStore, ['clients'])
  },
  created() {
    this.fetchFacture()
    this.getAllClients()
  },
  watch: {
    '$route.params.id': 'fetchFacture'
  },
  methods: {
    ...mapActions(useFactureStore, ['onSetFacture', 'onUpdateFacture', 'onDeleteFacture']),
    ...mapActions(useClientStore, ['getAllClients']),

    fetchFacture() {
      const factureId = this.$route.params.id
      this.onSetFacture(factureId)
    },
    addPrestation() {
      this.facture.prestations.push({
        description: '',
        qty: 0,
        price: 0
      })
      this.calculateTotal()
    },
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
    updateQuantity(index, value) {
      this.facture.prestations[index].qty = parseFloat(value) || 0
      this.calculateTotal()
    },
    updatePrice(index, value) {
      this.facture.prestations[index].price = parseFloat(value) || 0
      this.calculateTotal()
    },
    updateDescription(value) {
      this.facture.description = value
    },
    saveFacture() {
      this.onUpdateFacture(this.facture)
      this.$router.push({ path: '/factures' })
    },
    deleteFacture(factureId) {
      this.onDeleteFacture(factureId)
      this.$router.push({ path: '/factures' })
    }
  }
})
</script>
