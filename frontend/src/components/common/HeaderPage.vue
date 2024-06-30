<template>
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex flex-column">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <div>
      <slot name="button" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'description']
}
</script>

<style lang="scss" scoped></style>
