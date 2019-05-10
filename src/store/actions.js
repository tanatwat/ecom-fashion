export const addToCart = ({ commit }, { product }) => {

   commit('appendToCart', { product })
 
 }
 
 export const getCartCount = ({ commit }) => {
   //commit('setCount', localStorage.cart)

   if(localStorage.getItem("cart") === null) {
      commit('setCount', [])
      return Promise.resolve()
   } else {
      commit('setCount', JSON.parse(localStorage.getItem('cart')))
      return Promise.resolve()
   }
 }
 
 export const removeFromCart = ({ commit }, { index }) => {
   commit('removeCount', index)
 }