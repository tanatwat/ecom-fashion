export default {
  install: (Vue) => {
    Vue.prototype.$number= {
      format(amount) {
        if (amount) {
          return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
      }
    };
  }
};
