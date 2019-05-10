<template>
  <div class="columns">
    <div class="column"></div>
    <div class="column">
      <div class="content">
        <h4 class="has-text-primary">{{ product.name }}</h4>
        <h4>{{ $number.format(product.price) }}</h4>
        <h4 class="has-text-success">{{ $number.format(product.discount_price) }}</h4>
        <p>{{ product.description }}</p>
      </div>
      <div class>
        <button class="button is-primary is-fullwidth" @click="add">Add to Cart</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      product: {}
    };
  },
  methods: {
    ...mapActions(["addToCart"]),
    add() {
      this.addToCart({
        product: this.product
      });
    },
    getProduct() {
      this.$http
        .get("/get/product/" + this.$route.params.uid)
        .then(response => {
          this.product = response.data;
        });
    }
  },
  created() {
    this.getProduct();
  }
};
</script>