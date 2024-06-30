<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-5">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/" />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-md-auto gap-2">
          <li class="nav-item rounded">
            <RouterLink class="nav-link" to="/"
              ><i class="fa-solid fa-house"></i> Accueil</RouterLink
            >
          </li>
          <li class="nav-item rounded">
            <RouterLink class="nav-link" to="/factures"
              ><i class="fa-solid fa-file-invoice"></i> Factures</RouterLink
            >
          </li>
          <li class="nav-item rounded">
            <RouterLink class="nav-link" to="/clients"
              ><i class="fa-solid fa-user"></i> Clients</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  }
}
</script>
