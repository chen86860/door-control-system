export const HOST = {
  DEV: 'http://localhost:3000'
}
export default {
  getters: {
    goods: (state, getters) => {
      return HOST['DEV'] + '/api/goods'
    },
    detail: (state, getters) => {
      return HOST['DEV'] + '/api/detail'
    },
    login: (state, getters) => {
      return HOST['DEV'] + '/user/login'
    },
    signup: (state, getters) => {
      return HOST['DEV'] + '/user/signup'
    },
    session: (state, getters) => {
      return HOST['DEV'] + '/user/session'
    },
    cart: (state, getters) => {
      return HOST['DEV'] + '/user/cart'
    },
    addCart: (state, getters) => {
      return HOST['DEV'] + '/user/addCart'
    },
    changeChecked: (state, getters) => {
      return HOST['DEV'] + '/user/changeChecked'
    },
    cartGoodAdd: (state, getters) => {
      return HOST['DEV'] + '/user/cartGoodAdd'
    },
    cartGoodSub: (state, getters) => {
      return HOST['DEV'] + '/user/cartGoodSub'
    },
    prevCreateOrder: (state, getters) => {
      return HOST['DEV'] + '/user/prevCreateOrder'
    },
    adminSignup: (state, getters) => {
      return HOST['DEV'] + '/admin/signup'
    },
    adminLogin: (state, getters) => {
      return HOST['DEV'] + '/admin/login'
    },
    goodsIndex: (state, getters) => {
      return HOST['DEV'] + '/admin/goods/index'
    }
  }
}

