<template>
  <!-- select框的value就是选中的option的value -->
  <!-- 子组件不能修改父组件传递过来的prop数据, 遵循单向数据流 -->
  <!--
    1. 父传子, 传过来的value, 能够设置el-select
    2. 将来选择了, 还需要子传父, 将选择的值, 更新回父组件
   -->
  <el-select @change="changeSelect" :value="value" placeholder="请选择">
    <el-option
      v-for="item in channels"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { reqGetChannels } from '@/api/articles.js'
export default {
  name: 'MyChannels',
  data () {
    return {
      channels: [] // 存放所有的频道列表
    }
  },
  props: ['value'], // 父组件传递过来一个channel_id
  created () {
    // 发送请求, 获取所有的频道列表
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        const res = await reqGetChannels()
        this.channels = res.data.data.channels
      } catch (err) {
        console.log(err)
      }
    },
    changeSelect (val) {
      // console.log(val, '目标选中的值')
      // 子传父, 触发事件的同时传值
      // this.$emit('change-select', val)
      this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>
