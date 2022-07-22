import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal, setLocal } from '@/utils/storage'
Vue.use(Vuex)

const tokenKey = 'dianshang_token'

export default new Vuex.Store({
  state: {
    token: getLocal(tokenKey)
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      setLocal(tokenKey, token)
    }
  }
})
