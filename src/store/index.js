import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/cache'

Vue.use(Vuex)

export const set = (state, key, data) => {
  setItem(key, data)
  state[key] = data
}

export const store = new Vuex.Store({
  state: {
    userInfo: getItem('userInfo') || {},
    isDeveloper: undefined,
    cancelTokens: [],
    choosedCompanyChannel: '' //12月7日添加，选择的企业频道
  },
  mutations: {
    SET_USERINFO: (state, userInfo) => {
      set(state, 'userInfo', userInfo)
    },
    LOG_OUT: function(state) {
      set(state, 'userInfo', {})
    },
    ADD_CANCEL_TOKEN(state, token) {
      state.cancelTokens.push(token)
    },
    CLEAR_CANCEL_TOKENS(state) {
      state.cancelTokens = []
    },
    // 12月7日添加，设置选择的企业频道
    SET_CHOOSED_COMPANY_CHANNEL(state, companychannel) {
      state.choosedCompanyChannel = companychannel
    }
  },
  actions: {
    CANCEL_PENDING_REQUESTS(context) {
      // Cancel all request where a token exists
      context.state.cancelTokens.forEach((request, i) => {
        if(request.cancel){
          request.cancel();
        }
      })
      // Reset the cancelTokens store
      context.commit('CLEAR_CANCEL_TOKENS');
    }
  },
  getters: {
    cancelTokens(state) {
      return state.cancelTokens
    }
  },
  strict: false
})

export default store
