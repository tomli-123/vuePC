<template>
  <div class="home">
    <h3>这是首页</h3>
    <!-- 为了觉得使用起来麻烦, 因为每次都需要自己注册事件, v-model可以帮你注册事件 -->
    <!-- 1 :value="channel_id"  2 注册了input事件, 会将得到的值, 赋值给channel_id-->
    <my-channels v-model="channel_id"></my-channels>

    <my-channels v-model="channel_id2"></my-channels>

    <hr>
    <!--
      v-model等价于, 设置了 :value="username", 并且注册了 input 事件 @input, 将得到的值赋值给username
     -->
    <hm-input v-model="username" placeholder="请输入用户名"></hm-input> <hr>
    <hm-input v-model="password" placeholder="请输入密码"></hm-input>

    <hr>

    <!-- 只要cover一确定选择, 就在子组件中, 把对应的图片路径, 传递给父组件 -->
    <!-- :value="imgUrl" -->
    <my-cover v-model="imgUrl"></my-cover>
    <my-cover v-model="imgUrl2"></my-cover>

  </div>
</template>

<script>
import MyChannels from '@/components/my-channels.vue'
import MyCover from '@/components/my-cover.vue'
import HmInput from '@/components/hm-input.vue'
export default {
  name: 'Home',
  components: {
    MyChannels,
    MyCover,
    HmInput
  },
  data () {
    return {
      channel_id: 2,
      channel_id2: 3,
      username: 'zs',
      password: '123456',
      imgUrl: '',
      imgUrl2: ''
    }
  },
  methods: {
    // 我们提供的函数, 就在做一件事情, 将得到的值, 赋值给绑定的变量
    // fatherFn (id) {
    //   this.channel_id = id
    // },
    // fatherFn2 (id) {
    //   this.channel_id2 = id
    // }
  }
}
</script>

<style>

</style>
