<template>
  <div id="app">
    <!-- el-button组件的演示
         1. type 控制颜色 primary蓝色 success绿色 danger红色
         2. plain 简约风
    -->
    <!-- <el-button @click="fn">默认按钮</el-button>
    <el-button type="primary">蓝色按钮</el-button>
    <el-button type="success">绿色按钮</el-button>
    <el-button type="danger">红色按钮</el-button>
    <el-button plain type="danger">简约红色按钮</el-button>
    <el-button plain round type="danger">round按钮</el-button>
    <el-button plain circle type="danger">circle按钮</el-button> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    fn () {
      // axios.get('http://ttapi.research.itcast.cn/app/').then(res => {
      //   console.log(res.data)
      // })
      this.$http.get('/app/').then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="less">
</style>
