<template>
  <div class>
    <div class="cart" v-if="cartItems.length">
      <div class="cart-product" v-for="item in cartItems">
        <div class="level is-marginless">
          <div class="cart-remove">
            <a class="delete" @click.prevent="remove"></a>
          </div>
          <div class="cart-product-img level-item">
            <img
              :src="'https://s3-ap-southeast-1.amazonaws.com/images.peach/thumbnail/' + item.thumbnail"
            >
          </div>
        </div>

        <div class="level">
          <div class="cart-product-detail level-item has-text-left">
            <a :href="'/product/' + item.uid">{{ item.name }}</a>
          </div>
          <div class="cart-qty level-item">
            <div class="field has-addons has-addons-right">
              <p class="control">
                <a class="button is-primary" @click.prevent="changeQty('increase', item)">-</a>
              </p>
              <p class="control">
                <a class="button is-static">{{item.qty}}</a>
              </p>
              <p class="control">
                <a class="button is-primary" @click.prevent="changeQty('decrease', item)">+</a>
              </p>
            </div>
          </div>
          <div class="level-item">
            <p v-show="!item.discount_price">{{ $number.format(item.price) }}&nbsp;฿</p>
            <p v-show="item.discount_price">
              <s>{{ $number.format(item.price) }}</s>
              <span class="has-text-success">{{ $number.format(item.discount_price) }}&nbsp;฿</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section" v-else>
      <p class="is-size-3 has-text-centered">ไม่มีสินค้าในรถเข็น</p>
    </div>

    <section class="columns" v-show="cartItems.length" style="padding-top:2rem">
      <div class="content column">
        <h2
          class="subtitle has-text-success"
          v-show="!discountCalc"
        >ยอดชำระ&nbsp;{{ $number.format(priceCalc) }}&nbsp;THB</h2>
        <h2
          class="subtitle has-text-success"
          v-show="discountCalc"
        >ยอดชำระ&nbsp;{{ $number.format(discountCalc) }}&nbsp;THB</h2>
        <h4
          v-show="confirm.fee"
        >ค่าส่งสินค้า: {{ confirm.fee == 'FREE' ? 'FREE' : confirm.fee + ' THB' }}</h4>
        <h4 v-show="confirm.promotion">Promotion</h4>
        <p
          v-show="Object.keys(discount).length"
        >Discount&nbsp;-&nbsp;{{ discount.value }}{{ discount.type == 'percent' ? '%' : ' THB'}}</p>

        <div class="field has-addons">
          <p class="control">
            <input class="input" type="text" v-model="code" placeholder="CODE">
          </p>
          <p class="control">
            <a class="button is-success" :disabled="!code">ใช้ส่วนลด</a>
          </p>
        </div>
                <label class="label is-size-4">เลือกการจัดส่ง</label>
        <div class="shipping" v-for="(shipping, index) in shippings">
          <input
            :id="index"
            type="radio"
            name="choice"
            :value="shipping"
            v-model="confirm.shipping"
          >
          <label :for="index">
            {{ shipping.method }}&nbsp;{{ shipping.fee ? shipping.fee + ' THB' : 'FREE' }}
            <br v-show="shipping.multiply || shipping.promotion.type">
            <small
              v-show="shipping.multiply"
            >+{{ shipping.multiply }}&nbsp;THB ต่อชิ้นหากซื้อเกิน 2 ชิ้นขึ้นไป.</small>
            <br v-show="shipping.promotion.type">
            <small
              v-show="shipping.promotion.type"
            >ส่งฟรีเมื่อซื้อเกิน {{ shipping.promotion.amount }}&nbsp;{{ shipping.promotion.type == 'qty' ? 'ชิ้น' : 'บาท' }}</small>
          </label>
        </div>
      </div>

      <div class="column">
        <label class="label is-size-4">ที่อยู่ในการจัดส่ง</label>
        <form @submit.prevent="confirmOrder()" method="post">
          <form-input label="Name" name="name" type="text" validate-as="name" v-model="user.name"></form-input>
          <form-input
            label="Phone"
            name="name"
            type="text"
            validate-as="Phone"
            v-model="user.phone"
          ></form-input>
          <div class="field">
            <label class="label">Address</label>
            <textarea class="textarea" placeholder="Address" v-model="user.address"></textarea>
          </div>
          <div class="action-wrapper form-submit right buttons">
            <button class="button is-success" type="submit" :disabled="!confirm.shipping">สั่งซื้อ</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      imgUrl: "/file/product/thumbnail/",
      code: null,
      confirm: {
        shipping: null,
        fee: null,
        promotion: null
      },
      user: {},
      discount: {},
      shippings: []
    };
  },
  computed: {
    ...mapGetters({
      cartItems: "cartContent"
    }),

    priceCalc: function() {
      let totalPrice = [];
      let totalQty = [];
      Object.entries(this.cartItems).forEach(([key, val]) => {
        var subTotal = val.price * val.qty;
        totalPrice.push(subTotal);
        totalQty.push(val.qty);
      });

      var total = totalPrice.reduce(function(total, num) {
        return total + num;
      }, 0);
      var qty = totalQty.reduce(function(total, num) {
        return total + num;
      }, 0);
      if (this.confirm.shipping) {
        // If shipping is not free
        if (this.confirm.shipping.fee) {
          this.confirm.fee = this.confirm.shipping.fee;
          var includeFee = total + this.confirm.shipping.fee;
          if (this.confirm.shipping.multiply) {
            //multiply
            var multiplied =
              this.confirm.shipping.multiply * (qty - 1) + includeFee;
            if (this.confirm.shipping.promotion.type) {
              // multiply and promotion
              if (this.confirm.shipping.promotion.type == "qty") {
                // multiply and QTY promo
                // check if qty is more than promotion amount
                if (qty >= this.confirm.shipping.promotion.amount) {
                  this.confirm.fee = "FREE";
                  return multiplied - this.confirm.shipping.fee;
                } else {
                  this.confirm.fee =
                    this.confirm.shipping.fee +
                    this.confirm.shipping.multiply * (qty - 1);
                  return multiplied;
                }
              } else {
                // multiply and COST promo
                // check if total cost is more than promotion amount
                if (total > this.confirm.shipping.promotion.amount) {
                  this.confirm.fee = "FREE";
                  return multiplied - this.confirm.shipping.fee;
                } else {
                  this.confirm.fee =
                    this.confirm.shipping.fee +
                    this.confirm.shipping.multiply * (qty - 1);
                  return multiplied;
                }
              }
            } else {
              // if multiply bot no promo
              this.confirm.fee =
                this.confirm.shipping.fee +
                this.confirm.shipping.multiply * (qty - 1);
              return multiplied;
            }
          } else {
            // if not multiply
            if (this.confirm.shipping.promotion.type) {
              //not multiply but has promotion
              if (this.confirm.shipping.promotion.type == "qty") {
                // NO multiply BUT QTY promo
                // check if qty is more than promotion amount
                if (qty >= this.confirm.shipping.promotion.amount) {
                  this.confirm.fee = "FREE";
                  return includeFee - this.confirm.shipping.fee;
                } else {
                  return includeFee;
                }
              } else {
                // NO multiply BUT COST promo
                // check if COST is more than promotion amount
                if (total > this.confirm.shipping.promotion.amount) {
                  this.confirm.fee = "FREE";
                  return includeFee - this.confirm.shipping.fee;
                } else {
                  return includeFee;
                }
              }
            } else {
              //not multiply no promotion
              return includeFee;
            }
          }
        } else {
          // If shipping is free
          this.confirm.fee = "FREE";
          return total;
        }
      } else {
        // not select shipping yet
        return total;
      }
    },

    discountCalc: function() {
      if (this.discount.type == "percent") {
        var val = (this.discount.value / 100) * this.priceCalc;
        return this.priceCalc - val;
      } else {
        return this.priceCalc - this.discount.value;
      }
    }
  },
  methods: {
    ...mapActions(["removeFromCart"]),

    getShippings() {
      this.$http.get("/shippings").then(response => {
        this.shippings = response.data;
      });
    },

    changeQty(type, item) {
      if (type == "increase") {
        if (item.qty > 1) {
          item.qty = --item.qty;
          localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));
        }
      } else {
        item.qty = ++item.qty;
        localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));
      }
    },

    remove(index) {
      if (confirm("ลบสินค้าออกจากรถเข็น?")) {
        this.removeFromCart({ index });
      }
    },

    redeemCode() {
      this.$http.get("/api/get/redeem/" + this.code).then(
        response => {
          this.discount = response.data;
          this.code = null;
          toastr.success("ใช้ส่วนลดแล้ว");
        },
        response => {
          alert(
            "ไม่สามารถส่วนลดได้ อาจกรอกข้อมูลไม่ถูกต้องหรือส่วนลดถูกใช้ไปหมดแล้ว"
          );
        }
      );
    },

    confirmOrder() {
      if (confirm("ยืนยันการสั่งซื้อ?")) {
        this.$http
          .post("/cart/confirm", {
            name: this.user.name,
            address: this.user.address,
            phone: this.user.phone,
            body: this.cartContent,
            total: this.priceCalc,
            discount: this.discountCalc,
            shipping: this.confirm.shipping,
            fee: this.confirm.fee
          })
          .then(response => {
            var lineToken = "qt97GCNOcLtpcEp10Yioair47biAOXIdNLgAh1RMcgz";
            var Ajax = {
              async: true,
              crossDomain: true,
              url: `${"https://cors-anywhere.herokuapp.com/"}https://notify-api.line.me/api/notify`,
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + lineToken
              },
              data: {
                message: "มีการสั่งซื้อสินค้า " + response.data.title
              }
            };
            // var self = this;
            // $.ajax(Ajax).done(function() {
            //   document.location.href =
            //     self.$root.url + "/order/" + response.data.uid;
            // });
            // axios.post(`${'https://cors-anywhere.herokuapp.com/'}https://notify-api.line.me/api/notify`, { message: 'teste' }, config).then(response => {
            //   document.location.href = this.$root.url + '/order/' + response.data
            // }, response => {
            //   console.log(bodyParameters);
            // })
          });
      }
    }
  },
  mounted() {
    this.getShippings();
  }
};
</script>