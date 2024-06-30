<template>
  <div :class="['form-group', 'row', { 'has-error': error }, 'w-50', 'mb-3']">
    <label :for="id" class="col-sm-2 col-form-label">{{ label }}</label>
    <div class="col-sm-10">
      <input
        :type="type"
        :id="id"
        class="form-control border border-secondary"
        :class="[inputClass || 'w-100', { 'is-invalid border border-danger': error }]"
        :placeholder="placeholder"
        :value="modelValue"
        :readonly="readonly"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div class="invalid-feedback">
        {{ error ? 'Ce champ est obligatoire.' : '' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    modelValue: [String, Number],
    readonly: Boolean,
    inputClass: String,
    error: Boolean
  }
}
</script>
