import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'

import ClientView from '../views/Client/ClientView.vue'
import ClientEditView from '../views/Client/ClientEditView.vue'

import FactureView from '../views/Facture/FactureView.vue'
import FactureEditView from '../views/Facture/FactureEditView.vue'
import ClientCreateView from '@/views/Client/ClientCreateView.vue'
import FactureCreateView from '@/views/Facture/FactureCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tableau-de-bord',
      component: DashboardView
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientView
    },

    {
      path: '/clients/modifier/:id',
      name: 'clientsModifier',
      component: ClientEditView
    },
    {
      path: '/clients/ajouter',
      name: 'clientsAjouter',
      component: ClientCreateView
    },
    {
      path: '/factures',
      name: 'factures',
      component: FactureView
    },
    {
      path: '/factures/modifier/:id',
      name: 'facturesModifier',
      component: FactureEditView
    },
    {
      path: '/factures/ajouter',
      name: 'facturesAjouter',
      component: FactureCreateView
    }
  ]
})

export default router
