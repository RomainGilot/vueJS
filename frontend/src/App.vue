<template>
  <NavbarPage />
  <RouterView />
  <FooterPage />
</template>

<script>
import NavbarPage from '@/components/common/NavbarPage.vue'
import FooterPage from '@/components/common/FooterPage.vue'

export default {
  components: {
    NavbarPage,
    FooterPage
  }
}
</script>
