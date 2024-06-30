<template>
  <div class="container py-5">
    <HeaderPage title="Éditer un client" description="Vous pouvez éditer les données d'un client">
      <template v-slot:button>
        <ButtonHeader
          icon='<i class="fa-solid fa-trash"></i>'
          text="Supprimer le client"
          color="danger"
          @click="deleteClient(client.id)"
        />
        <RouterLink
          class="ms-3 btn btn-sm border-3 border-primary text-primary py-2 fw-bold rounded-lg"
          to="/clients"
        >
          <i class="fa-solid fa-arrow-left-long"></i>
          Retour
        </RouterLink>
        <button
          class="ms-3 btn btn-sm border-3 border-success text-success py-2 fw-bold rounded-lg"
          @click="saveClient"
          :disabled="!isFormValid"
        >
          <i class="fa-solid fa-save"></i>
          Sauvegarder
        </button>
      </template>
    </HeaderPage>

    <div class="mt-3 p-3 rounded-3" style="background-color: #f7f7f7">
      <h3 class="mb-5">Contact</h3>
      <div class="d-flex">
        <FormInput
          id="prenomClient"
          label="Prénom*"
          v-model="client.firstName"
          :error="!client.firstName"
        />
        <FormInput
          id="nomClient"
          label="Nom*"
          v-model="client.lastName"
          :error="!client.lastName"
        />
      </div>
      <div class="d-flex mt-3">
        <FormInput
          id="fonctionClient"
          label="Fonction*"
          v-model="client.fonction"
          :error="!client.fonction"
        />
        <FormInput
          id="telClient"
          label="Téléphone*"
          v-model="client.contact.phone"
          :error="!client.contact.phone"
        />
      </div>
      <div class="mt-3">
        <FormInput
          id="emailClient"
          label="Email*"
          v-model="client.contact.email"
          inputClass="w-100"
          :error="!client.contact.email"
        />
      </div>
      <div class="mt-4">
        <FormInput
          id="entrepriseClient"
          label="Entreprise*"
          v-model="client.companyName"
          inputClass="w-100"
          :error="!client.companyName"
        />
      </div>
    </div>

    <div class="mt-3 p-3 rounded-3" style="background-color: #f7f7f7">
      <h3 class="mb-5">Coordonnées</h3>
      <div class="mt-3">
        <FormInput
          id="adresse1Client"
          label="Adresse 1*"
          v-model="client.address.address1"
          inputClass="w-100"
          :error="!client.address.address1"
        />
      </div>
      <div class="mt-4">
        <FormInput
          id="adresse2Client"
          label="Adresse 2"
          v-model="client.address.address2"
          inputClass="w-100"
        />
      </div>
      <div class="d-flex mt-3">
        <FormInput
          id="cpClient"
          label="CP*"
          v-model="client.address.postalCode"
          :error="!client.address.postalCode"
        />
        <FormInput
          id="villeClient"
          label="Ville*"
          v-model="client.address.city"
          :error="!client.address.city"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import FormInput from '@/components/FormInput.vue'
import { RouterLink } from 'vue-router'
import { useClientStore } from '@/stores/clients'
import { mapState, mapActions } from 'pinia'

export default {
  components: {
    HeaderPage,
    ButtonHeader,
    FormInput,
    RouterLink
  },
  data() {
    return {
      isReadonly: true
    }
  },
  computed: {
    ...mapState(useClientStore, ['client']),
    isFormValid() {
      return !!(
        this.client.firstName &&
        this.client.lastName &&
        this.client.fonction &&
        this.client.contact.phone &&
        this.client.contact.email &&
        this.client.companyName &&
        this.client.address.address1 &&
        this.client.address.postalCode &&
        this.client.address.city
      )
    }
  },
  created() {
    this.fetchClient()
  },
  watch: {
    '$route.params.id': 'fetchClient'
  },
  methods: {
    ...mapActions(useClientStore, ['onSetClient', 'onUpdateClient', 'onDeleteClient']),
    async fetchClient() {
      const clientId = this.$route.params.id
      await this.onSetClient(clientId)
    },
    async saveClient() {
      if (!this.isFormValid) {
        console.error('Veuillez remplir tous les champs obligatoires.')
        return
      }

      try {
        await this.onUpdateClient(this.client)
        this.$router.push({ path: '/clients' })
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du client:', error)
      }
    },
    async deleteClient(clientId) {
      try {
        await this.onDeleteClient(clientId)
        this.$router.push({ path: '/clients' })
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error)
      }
    }
  }
}
</script>

<style scoped>
.has-error .form-control {
  border-color: red;
}
.invalid-feedback {
  color: red;
}
</style>
