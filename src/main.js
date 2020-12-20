import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './utils/request.js'

// 导入 Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入全局的样式, 在脚手架环境中 .vue / .less / .css / .png / .js 一系列文件, 都可以导入
// 脚手架会自动根据不同的文件类型, 会做不同的解析处理的
// 如果 import 了 css 或者 less, 那么就会直接作用于页面
import '@/styles/index.less'
import HmButton from '@/components/hm-button.vue'
// import JSONbig from 'json-bigint'
// json-bigint 扩展了两个方法, 用起来和 正常的 JSON.parse 和 JSON.stringify 一致
// 1. JSONbig.parse(JSON字符串)
// 2. JSONbig.stringify(对象/数组)
// ------------------------------------------------------------------
// const obj = {
//   name: 'zs',
//   age: 18
// }
// console.log(JSONbig.stringify(obj)) // {"name":"zs","age":18}
// ------------------------------------------------------------------
// const jsonStr = '{"name":"zs","age":18}'
// console.log(JSONbig.parse(jsonStr))
// -------------------------------------------------------------------
// 如果没有大数, 正常使用, 如果有大数, JSONbig, 就会将大数转成 BigNumber 类型
// BigNumber类型要使用, 需要 toString 一下
// const jsonStr = '{"id": 1318007835426029568, "name":"zs", "age":18}'
// console.log(JSON.parse(jsonStr))
// console.log(JSON.parse(jsonStr).id) // 这里拿到的就是丢失进度的id, 不好的!

// console.log(JSONbig.parse(jsonStr))
// console.log(JSONbig.parse(jsonStr).id.toString()) // 拿到就是准确的 id 类型
// ----------------------------------------------------------------------

// 一般基于vue的插件, 都是需要 use 一下, 例如: vue-router ElementUI vuex ...
Vue.use(ElementUI)

// 注册全局组件
Vue.component('hm-button', HmButton)

// 仅仅是控制控制台的一条提示(可选)
Vue.config.productionTip = false

// 将http请求模块, 挂载到原型
// 将来请求, this.$http.get(url).then(...)
Vue.prototype.$http = http

// 创建一个都能访问的事件总线
// 将来所有实例中, 可以 this.$eventBus 访问到 事件总线
Vue.prototype.$eventBus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
