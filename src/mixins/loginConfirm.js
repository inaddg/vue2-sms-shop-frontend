export default {
  // 此处编写的就是 Vue组件实例的配置型，通过一定语法，可以直接混入到组件内部
  // data methods 生命周期钩子...都可以混入
  // 注意：
  // 1.如果此处和组件内，提供了同名的data、methods，则组件内优先级更高
  // 2.如果编写了生命周期函数，则mixins中的生命周期函数 和 页面的生命周期函数，会用数组管理统一执行
  methods: {
    loginConfirm () {
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请先登录',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => { // 点击确认按钮之后要去干嘛
          // 登录后能跳转回来
            this.$router.replace({ // replace :去做替换页面，而不是追加
              path: '/login',
              // 额外携带参数backUrl(之前页面的地址)
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => { }) // 点击取消按钮之后要去干嘛
        return true
      }
      return false
    }
  }
}
