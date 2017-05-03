import Vue from 'vue'
export const types = {
  mutations: {
    GET: 'increment'
  }
}

export default {
  state: {
    cart: {},
    goods: {},
    detail: {}
  },
  mutations: {
    setCart: (state, payload) => {
      if (payload === undefined) return
      state.cart = payload
    },
    setGoods: (state, payload) => {
      if (payload === undefined) return
      state.goods = payload.msg
    },
    setDetails: (state, payload) => {
      if (payload === undefined) return
      state.detail = payload.msg[0]
    }
  },
  actions: {
    goods ({commit, state, getters}, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(getters['goods'], payload).then((res) => {
          console.log('goods', res.code, res)
          if (res.data.code === 0) {
            commit('setGoods', res.data)
          }
          resolve(res)
        })
      })
    },
    detail ({commit, state, getters}, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(getters['detail'], payload).then((res) => {
          console.log('detail', res.code, res)
          if (res.data.code === 0) {
            commit('setDetails', res.data)
          }
          resolve(res)
        })
      })
    },
    login ({ commit, state, getters }, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(getters['login'], payload).then((res) => {
          console.log('login', res.code, res)
          resolve(res)
        })
      })
    },
    signup ({ commit, state, getters }, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(getters['signup'], payload).then((res) => {
          console.log('signup', res.data.code, res)
          commit('setSession', res.data)
          resolve(res)
        })
      })
    },
    cart ({ commit, state, getters }, payload) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(getters['cart'], payload).then((res) => {
          console.log('cart', res.data.code, res)
          commit('setCart', res.data)
          resolve(res)
        })
      })
    }
  }
}