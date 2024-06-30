<template>
  <div>
    <div class="d-flex justify-content-end mb-3 mt-3">
      <input type="text" class="form-control w-25" v-model="keywords" placeholder="Rechercher..." />
    </div>
    <table class="table">
      <thead class="table-dark">
        <tr>
          <th v-for="(column, index) in columns" :key="index">{{ column.label }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredRows.length === 0">
          <td :colspan="columns.length + 1" class="text-center">Aucun résultat trouvé</td>
        </tr>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
          <td v-for="(column, colIndex) in columns" :key="colIndex">
            <!-- Exception de certaine colonne -->
            <span v-if="column.prop === 'totalHT' || column.prop === 'totalTTC'">
              {{ formatPrice(getAllInfo(row, column.prop)) }}
            </span>
            <span v-else-if="column.prop === 'factureClientInfo'">
              {{ getFactureClientInfo(row.client) }}
            </span>
            <span v-else-if="column.prop === 'clientName'">
              {{ getClientName(row) }}
            </span>
            <span v-else>
              {{ getAllInfo(row, column.prop) }}
            </span>
          </td>
          <td>
            <router-link
              :to="`/${entity}/modifier/${row.id}`"
              class="btn btn-sm btn-primary me-2"
              title="Modifier"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </router-link>
            <button class="btn btn-sm btn-danger" @click="supprimer(row)" title="Supprimer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    rows: Array,
    columns: Array,
    entity: String,
    onDelete: Function
  },
  data() {
    return {
      keywords: ''
    }
  },
  computed: {
    filteredRows() {
      if (this.keywords) {
        const searchTerm = this.keywords.toLowerCase()
        return this.rows.filter((row) => {
          return this.columns.some((column) => {
            const cellValue = String(this.getAllInfo(row, column.prop)).toLowerCase()
            return cellValue.includes(searchTerm)
          })
        })
      }
      return this.rows
    }
  },
  methods: {
    formatPrice(price) {
      return `${price} €`
    },
    getAllInfo(obj, prop) {
      console.log(prop.split('.').reduce((o, i) => (o ? o[i] : ''), obj))

      return prop.split('.').reduce((o, i) => (o ? o[i] : ''), obj)
    },
    getFactureClientInfo(client) {
      return `${client.firstName} ${client.lastName}`
    },
    getClientName(clients) {
      return `${clients.firstName} ${clients.lastName}`
    },
    supprimer(row) {
      this.onDelete(row.id)
    }
  }
}
</script>
