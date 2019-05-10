<template>
  <div id="app">
    <div class="nav-bar w-nav">
      <div class="nav-container">
        <div class="left-side">
          <a href="#" class="logo-wrapper w-nav-brand">
            <img src="./assets/logo.png" alt class="site-logo">
          </a>
          <div class="w-nav-button">
            <div class="w-icon-nav-menu"></div>
          </div>
        </div>
        <div class="right-side">
          <div role="navigation" class="nav-menu w-nav-menu">
            <router-link to="/products" class="nav-link w-nav-link">PRODUCTS</router-link>
            <router-link to="/about" class="nav-link w-nav-link">ABOUT</router-link>
            <router-link to="/" class="nav-link w-nav-link">ACCOUNTS</router-link>
            <router-link to="/" class="nav-link w-nav-link">LOGIN</router-link>
          </div>
          <router-link to="/cart" class="cart-button w-button">CART&nbsp;{{ cartCount }}</router-link>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- PAGE TITLE -->
      <h1 class="title">Hero title</h1>
      <h2 class="subtitle">Hero subtitle</h2>
      <!-- ROUTER VIEW -->
      <router-view/>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters({
      cartCount: 'count'
    })
  },
  methods: {
    ...mapActions(['getCartCount'])
  },
  created() {
    this.getCartCount()
  },
}
</script>

<style lang="sass">
@import "./assets/sass/app.sass"
</style>
