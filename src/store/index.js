// 全局
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  // 全局的getters-token
  getters: {
    token (state) {
      return state.user.userInfo.token
    }
  },
  modules: {
    user,
    cart
  }
})
