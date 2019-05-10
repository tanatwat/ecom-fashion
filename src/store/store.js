import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from './state'
// import mutations from './mutations'
// import actions from './actions'
// import getters from './getters'
const mutations = require('./mutations');
const actions = require('./actions');
const getters = require('./getters');

export const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
