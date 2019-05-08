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
          <router-link to="/" class="cart-button w-button">CART</router-link>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="sass">
@import "./assets/sass/app.sass"
</style>
