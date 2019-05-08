<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
      class="input"
      :value="value"
      :class="{'is-danger' : errors.first(name) }"
      :data-vv-as="validateAs" :type="type"
      v-validate="validate"
      :name="name"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"/>
    </div>
    <p class="help is-danger" v-show="errors.first(name)">{{ errors.first(name) }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    validate: {
      type: String,
      default: null
    },
    validateAs: {
      type: String,
      default: null
    }
  }
}
</script>
