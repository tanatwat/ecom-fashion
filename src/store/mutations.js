export const setCount = (state, items) => {
  state.cart = items;
};

export const removeCount = (state, index) => {
  state.cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(state.cart));
};

export const appendToCart = (state, { product }) => {
  if (state.cart.length) {
    state.cart.find(item => {
      if (item.id === product.id) {
        item.qty++;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      } else {
        let cart = JSON.parse(localStorage.getItem("cart"));
        cart.push(Object.assign(product, { qty: 1 }));
        console.log(cart);
        state.cart = cart;
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });
  } else {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.push(Object.assign(product, { qty: 1 }));
    state.cart = cart;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};
