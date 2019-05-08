<template>
  <transition name="fade">
    <div class="modal" :class="{'is-active' : $root.showModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",
  methods: {
    close() {
      this.$emit("close");
    }
  },
  watch: {
    "$root.showModal": {
      handler() {
      const page = document.documentElement
        if (this.$root.showModal) {
          page.classList.add("stop-scroll");
        } else {
          page.classList.remove("stop-scroll");
        }
      }
    }
  }
};
</script>