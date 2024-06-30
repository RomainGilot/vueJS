<template>
  <button :class="['btn btn-sm border-3 py-2 fw-bold rounded-lg', colorClass]">
    <span v-html="icon"></span> {{ text }}
  </button>
</template>

<script>
export default {
  props: ['icon', 'text', 'color'],
  computed: {
    colorClass() {
      return `text-${this.color} border-${this.color}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
