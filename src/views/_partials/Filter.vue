<template>
  <div>
    <div class="level is-mobile">
      <div class="level-left">
        <button class="button primary" @click.prevent="formVisible = !formVisible">
          ตัวกรอง&nbsp;
          <i class="fas fa-filter"></i>
        </button>
      </div>
      <div class="level-right">
        <button
          v-show="canToggleView"
          class="button icon fas fa-th-list"
          :class="{'active' : $parent.view == 'row'}"
          @click="$emit('changeView', 'row')"
        ></button>
        <button
          v-show="canToggleView"
          class="button icon fas fa-th-large"
          :class="{'active' : $parent.view == 'grid'}"
          @click="$emit('changeView', 'grid')"
        ></button>
      </div>
    </div>
    <transition name="fade">
      <div v-show="formVisible" class="box filter" style="margin-top:15px !important">
        <div class="is-flex-tablet align-form child-is-half">
          <div class="field">
            <form-input
              label="ชื่อสินค้า"
              name="name"
              type="text"
              validate-as="ชื่อสินค้า"
              v-model="query.name"
            ></form-input>
          </div>
          <div class="control" style="margin-bottom:.75rem">
            <label class="label">เรียงตาม</label>
            <div class="select is-fullwidth">
              <select v-model="query.order">
                <option value="min">ราคาต่ำสุดก่อน</option>
                <option value="max">ราคาสูงสุดก่อน</option>
              </select>
            </div>
          </div>
        </div>

        <div id="category">
          <label class="label">หมวดหมู่</label>
          <div class="categories">
            <div class="category">
              <li
                :key="category.id"
                v-for="category in categories"
                @click.prevent="selectCategory(category)"
                :class="{'active': category.id == query.c }"
              >{{ category.name }}</li>
            </div>
            <div class="category" v-show="query.c && subcategories.length">
              <li
                :key="subcategory.id"
                v-for="subcategory in subcategories"
                @click.prevent="selectSubcategory(subcategory)"
                :class="{'active': subcategory.id == query.sub }"
              >{{ subcategory.name }}</li>
            </div>
            <div class="category" v-show="query.sub && types.length">
              <li
                :key="type.id"
                v-for="type in types"
                @click.prevent="selectType(type)"
                :class="{'active': type.id == query.type }"
              >{{ type.name }}</li>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">ราคา</label>
          <div class="is-flex align-form child-is-half">
            <div class="control is-expanded">
              <input
                class="input"
                type="number"
                min="0"
                max="9999999"
                v-model="query.min"
                autocomplete="off"
                placeholder="ต่ำสุด"
              >
            </div>
            <div class="control is-expanded">
              <input
                class="input"
                type="number"
                min="0"
                max="9999999"
                v-model="query.max"
                autocomplete="off"
                placeholder="สูงสุด"
              >
            </div>
          </div>
        </div>

        <div v-show="includeDiscount">
          <label class="checkbox padding" :class="{'active' : query.dc}">
            เฉพาะสินค้าลดราคา&nbsp;
            <input
              class
              type="checkbox"
              name="discount"
              @click.prevent="toggleDiscount"
            >
          </label>
        </div>

        <transition name="fade">
          <div class="breadcrumb" v-show="activated">
            <p class="is-size-5">คุณกำลังค้นหา</p>
            <span v-show="query.name">
              <strong>ชื่อสินค้า</strong>
              &nbsp;{{ query.name }}
            </span>
            <div v-show="query.c">
              <strong>หมวดหมู่&nbsp;</strong>
              <span>{{ breadcrumb.category }}</span>
              <span>{{ breadcrumb.subcategory }}</span>
              <span>{{ breadcrumb.type }}</span>
            </div>
            <span
              v-show="query.order"
            >{{ query.order == 'min' ? 'ราคาต่ำสุดก่อน' : 'ราคาสูงสุดก่อน' }}</span>
            <span v-show="query.min">ราคาต่ำสุด&nbsp;{{ $number.format(query.min) }}&nbsp;</span>
            <span v-show="query.max">ราคาสูงสุด&nbsp;{{ $number.format(query.max) }}</span>
            <span class="font-green" v-show="query.dc">สินค้าลดราคาเท่านั้น</span>
          </div>
        </transition>
        <div class="action-wrapper form-submit has-margin right">
          <button class="button" type="button" @click.prevent="clearFilter()">ล้างการค้นหา</button>
          <button
            type="button"
            class="button success"
            @click.prevent="search(1)"
            style="margin-right:0"
          >ค้นหา</button>
        </div>
      </div>
    </transition>

    <p
      style="margin-top:20px"
    >สินค้า&nbsp;{{ $parent.meta.total_items }}&nbsp;รายการ&nbsp;ทั้งหมด&nbsp;{{ $parent.meta.last_page }}&nbsp;หน้า</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      subcategories: [],
      types: [],
      products: [],
      formVisible: false,
      breadcrumb: {},
      query: {
        name: null,
        order: null,
        c: null,
        sub: null,
        type: null,
        max: null,
        min: null,
        dc: this.includeDiscount ? null : false,
        except:
          this.parentData.component == "showcase"
            ? JSON.stringify(this.parentData.query)
            : null,
        page: 1
      },
      view: this.$parent.view
    };
  },
  watch: {
    "$parent.meta.current_page": {
      handler() {
        this.query.page = this.$parent.meta.current_page;
        this.search(2);
      }
    }
  },
  props: {
    canToggleView: {
      type: Boolean,
      default: true
    },
    includeDiscount: {
      type: Boolean,
      default: true
    },
    parentData: {
      type: Object,
      default: () => {
        return {
          component: null,
          query: null
        };
      }
    },
    url: {
      default: "/get/products"
    }
  },
  computed: {
    activated() {
      if (
        this.query.c ||
        this.query.min ||
        this.query.max ||
        this.query.dc ||
        this.query.name ||
        this.query.order
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getCategory() {
      this.$root.loading = true;
      this.$http.get("/categories").then(response => {
        this.categories = response.data;
        this.$root.loading = false;
      });
    },
    search(type) {
      this.products = [];
      if (type == 1) {
        this.query.page = 1;
      }
      this.$http
        .get(this.url, {
          params: this.query
        })
        .then(
          response => {
            let products = response.data.data;
            let meta = {
              last_page: response.data.lastPage,
              current_page: response.data.page,
              total_items: response.data.total,
              page_items: response.data.perPage
            };
            this.$emit("search", { products, meta });
          },
          () => {
            toastr.error("เกิดข้อผิดพลาด");
          }
        );
    },
    clearFilter() {
      var cleared = _.mapValues(this.query, () => null);
      this.query = cleared;
      this.query.page = 1;
      this.search(1)
    },
    selectCategory(category) {
      this.subcategories = category.subcategory;
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        category: category.name,
        subcategory: null,
        type: null
      });
      this.query = Object.assign({}, this.query, {
        c: category.id,
        sub: null,
        type: null
      });
    },
    selectSubcategory(subcategory) {
      this.types = subcategory.type;
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        subcategory: subcategory.name,
        type: null
      });
      this.query = Object.assign({}, this.query, {
        sub: subcategory.id,
        type: null
      });
    },
    selectType(type) {
      this.breadcrumb = Object.assign({}, this.breadcrumb, {
        type: type.name
      });
      this.query = Object.assign({}, this.query, {
        type: type.id
      });
    },
    toggleDiscount() {
      if (this.query.dc) {
        this.query.dc = null;
      } else {
        this.query.dc = true;
      }
    }
  },
  created() {
    this.getCategory();
    this.search(1);
  }
};
</script>

<style lang="sass">
  .filter
    .categories
      min-width: 100%
      margin: 10px 0
      .category
        padding: 8px
        background: #f2f2f2
        border-radius: 8px
        overflow-x: auto
        overflow-y: hidden
        white-space: nowrap
        &:not(:last-child)
          margin-bottom: 15px
      li
        cursor: pointer
        display: inline-block
        margin: 0 10px
        padding: 8px 12px
        background: #ddd
        color: #777
        border-radius: 8px
        &.active
          color: #fff
          background: #6dc55a
</style>