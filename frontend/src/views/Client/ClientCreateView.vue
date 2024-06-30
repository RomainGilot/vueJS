<template>
  <div class="container py-5">
    <HeaderPage
      title="Créer un nouveau client"
      description="Remplissez les informations ci-dessous pour créer un nouveau client."
    >
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
          @click="createClient"
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
          id="firstName"
          label="Prénom*"
          v-model="client.firstName"
          :readonly="false"
          :error="!client.firstName"
        />
        <FormInput
          id="lastName"
          label="Nom*"
          v-model="client.lastName"
          :readonly="false"
          :error="!client.lastName"
        />
      </div>
      <div class="d-flex mt-3">
        <FormInput
          id="fonction"
          label="Fonction*"
          v-model="client.fonction"
          :readonly="false"
          :error="!client.fonction"
        />
        <FormInput
          id="phone"
          label="Téléphone*"
          v-model="client.contact.phone"
          :readonly="false"
          :error="!client.contact.phone"
        />
      </div>
      <div class="mt-3">
        <FormInput
          id="email"
          label="Email*"
          v-model="client.contact.email"
          :readonly="false"
          inputClass="w-100"
          :error="!client.contact.email"
        />
      </div>
      <div class="mt-4">
        <FormInput
          id="companyName"
          label="Entreprise*"
          v-model="client.companyName"
          :readonly="false"
          inputClass="w-100"
          :error="!client.companyName"
        />
      </div>
    </div>

    <div class="mt-3 p-3 rounded-3" style="background-color: #f7f7f7">
      <h3 class="mb-5">Coordonnées</h3>
      <div class="mt-3">
        <FormInput
          id="address1"
          label="Adresse 1*"
          v-model="client.address.address1"
          :readonly="false"
          inputClass="w-100"
          :error="!client.address.address1"
        />
      </div>
      <div class="mt-4">
        <FormInput
          id="address2"
          label="Adresse 2"
          v-model="client.address.address2"
          :readonly="false"
          inputClass="w-100"
        />
      </div>
      <div class="d-flex mt-3">
        <FormInput
          id="postalCode"
          label="CP*"
          v-model="client.address.postalCode"
          :readonly="false"
          :error="!client.address.postalCode"
        />
        <FormInput
          id="city"
          label="Ville*"
          v-model="client.address.city"
          :readonly="false"
          :error="!client.address.city"
        />
      </div>
      <div class="mt-3">
        <FormInput
          id="country"
          label="Pays*"
          v-model="client.address.country"
          :readonly="false"
          inputClass="w-100"
          :error="!client.address.country"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import HeaderPage from '@/components/common/HeaderPage.vue'
import ButtonHeader from '@/components/ButtonHeader.vue'
import FormInput from '@/components/FormInput.vue'
import { RouterLink } from 'vue-router'
import { useClientStore } from '@/stores/clients'
import { mapActions } from 'pinia'

export default defineComponent({
  components: {
    HeaderPage,
    ButtonHeader,
    FormInput,
    RouterLink
  },
  data() {
    return {
      client: {
        firstName: '',
        lastName: '',
        fonction: '',
        addedDate: new Date(),
        companyName: '',
        contact: {
          phone: '',
          email: ''
        },
        address: {
          address1: '',
          address2: '',
          postalCode: '',
          city: '',
          country: ''
        }
      }
    }
  },
  methods: {
    ...mapActions(useClientStore, ['onCreateClient']),
    async createClient() {
      if (
        !this.client.firstName ||
        !this.client.lastName ||
        !this.client.fonction ||
        !this.client.contact.phone ||
        !this.client.contact.email ||
        !this.client.companyName ||
        !this.client.address.address1 ||
        !this.client.address.postalCode ||
        !this.client.address.city ||
        !this.client.address.country
      ) {
        console.error('Veuillez remplir tous les champs obligatoires.')
        return
      }

      try {
        await this.onCreateClient(this.client)
        this.$router.push({ path: '/clients' })
      } catch (error) {
        console.error('Erreur lors de la création du client:', error)
      }
    }
  },
  computed: {
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
        this.client.address.city &&
        this.client.address.country
      )
    }
  }
})
</script>

<style scoped>
.has-error .form-control {
  border-color: red;
}
.invalid-feedback {
  color: red;
}
</style>
