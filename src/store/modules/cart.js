import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    // 提供一个设置 cartList 的方法
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      // 根据商品 id 找到对应的商品
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    // 全选按钮的选中状态
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    // 提供异步获取 cartList 的方法
    async getCartAction (context) {
      const { data } = await getCartList()

      // 后台返回的数据中，不包含复选框的选中状态，为了方便后续操作
      // 手动给每一项添加一个 checked 属性（标记当前商品是否选中）
      data.list.forEach(item => {
        item.isChecked = true
      })

      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改 -> mutations
      context.commit('changeCount', { goodsId, goodsNum })
      // 在同步到后台 -> 后台服务器
      await changeCount(goodsId, goodsNum, goodsSkuId)
      // console.log(res)
    },
    // 删除商品
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      // console.log(cartIds)
      await delSelect(cartIds)
      Toast.success('删除成功')

      // 重新拉取购物车数据
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 求所有商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品总价格
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
