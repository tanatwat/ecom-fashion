<template>
  <section style="padding: 30px 0" v-show="products.length">
    <div :class="`product-${view}`">
      <div class="product-card" v-for="(item, index) in products">
        <div class="product-img-wrapper">
          <span
            class="stock-status fas fa-circle"
            :class="item.stock < 1 ? 'unavailable' : 'available'"
            v-show="showStock"
          ></span>
          <a :href="/product/ + item.uid">
            <img
              :src="'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + item.thumbnail"
              alt
            >
          </a>
        </div>
        <div class="product-card-sub">
          <div class="product-details-wrapper centered">
            <a
              class="product-link"
              @click.prevent="$emit('link-click', Object.assign(item, {index: index}))"
            >{{ item.name }}</a>
            <p
              class="product-detail"
              v-show="!item.discount_price"
            >{{ $number.format(item.price) + ' บาท' }}</p>
            <p class="product-detail" v-show="item.discount_price">
              <strike>{{$number.format(item.price)}}</strike>&nbsp;
              <span
                class="has-text-success"
              >{{ $number.format(item.discount_price) + ' บาท' }}</span>
            </p>
            <p
              class="product-detail"
              :class="item.stock >= 1 ? 'font-success' : 'font-error'"
              v-show="showStock"
            >{{ item.stock >= 1 ? `มีสินค้า : ${item.stock}` : 'สินค้าหมด' }}</p>
          </div>
          <div class="product-action-wrapper" :class="actionBarClass" v-if="actionBar">
            <button
              class="button icon fas fa-cart-plus"
              type="button"
              @click="$emit('add-to-cart', Object.assign(item, {index: index}))"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    view: {
      type: String,
      default: "grid"
    },
    products: {
      type: Array,
      required: true
    },
    showStock: {
      type: Boolean,
      default: false
    },
    removeOptions: {
      type: Object,
      default: () => {
        return {
          success: "ลบสินค้าแล้ว",
          confirm: "คุณต้องการลบสินค้านี้?"
        };
      }
    },
    actionBar: {
      default: false
    },
    actionBarClass: {
      default: null
    },
    editButton: {
      default: false
    },
    removeButton: {
      default: false
    },
    actionButton: {
      type: Object,
      default: () => {
        return {
          enabled: false,
          title: null
        };
      }
    }
  },
  methods: {
    stockCalc(item, index) {
      if (item.choice.length) {
        var sum = _.sumBy(item.choice, function(o) {
          return o.qty;
        });
        this.products[index].stock = sum;
        return sum;
      } else {
        return item.stock;
      }
    },
    saleCalc(price, discount) {
      var val = (price - discount) / ((price + discount) / 2);
      var result = val * 100;
      return Math.round(result);
    },
    remove(uid, index) {
      if (confirm(this.removeOptions.confirm)) {
        this.$http.delete("/products/" + uid).then(
          () => {
            this.$parent.products.splice(index, 1);
            toastr.success(this.removeOptions.success);
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
      }
    }
  }
};
</script>