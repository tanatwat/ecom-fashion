<template>
  <div class="w-container">
    <div>
      <h1 class="page-title">Products</h1>
    </div>

    <div>
      <search-filter
        :can-toggle-view="true"
        :include-discount="true"
        v-on:search="assignData($event)"
        v-on:changeView="view = $event"
      ></search-filter>
      <pagination :meta="meta" v-show="products.length"></pagination>
      <products
        ref="child"
        :products="products"
        :view="view"
        v-on:link-click="$emit('link-click', $event)"
        :action-bar="false"
      ></products>
      <pagination :meta="meta" v-show="products.length"></pagination>
      <div class="content text-center" v-show="!products.length">
        <h4>ไม่มีสินค้า</h4>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "./_partials/Pagination.vue";
import SearchFilter from "./_partials/Filter.vue";
import Products from "./_partials/ProductContainer.vue";
export default {
  components: {
    Pagination,
    SearchFilter,
    Products
  },
  data() {
    return {
      products: [],
      meta: {},
      view: "grid"
    };
  },
  methods: {
    assignData(data) {
      this.products = data.products;
      this.meta = data.meta;
    }
  }
};
</script>